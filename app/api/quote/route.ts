import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeText, contentViolation } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/quote — Secure quote-request endpoint.
 * Security stack:
 *  - CORS whitelist (official frontend domain only)
 *  - IP rate limiting: 5 req/min (anti-DoS / anti-spam)
 *  - Zod strict schema validation
 *  - XSS sanitization + spam/offensive content gate (400)
 *  - Security headers via next.config.js (HSTS, CSP, X-Content-Type-Options) = Helmet.js equivalent
 */

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.length === 0 ? "" : ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return allowed ? { "Access-Control-Allow-Origin": allowed, Vary: "Origin" } : {};
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

const QuoteItemSchema = z.object({
  equipmentId: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  qty: z.number().int().min(1).max(100),
  note: z.string().max(300).optional().default(""),
});

const QuoteSchema = z.object({
  client: z.object({
    name: z.string().min(2).max(120),
    city: z.string().min(2).max(120),
    phone: z.string().min(8).max(40),
    notes: z.string().max(1000).default(""),
  }),
  items: z.array(QuoteItemSchema).min(1).max(30),
});

export async function POST(req: NextRequest) {
  // ── 1. CORS gate ──────────────────────────────────────────────
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin não permitida." }, { status: 403 });
  }

  // ── 2. Rate limit: 5 req/min/IP ───────────────────────────────
  const rl = rateLimit(req, 5, 60_000);
  const baseHeaders = {
    ...corsHeaders(req),
    "X-RateLimit-Limit": "5",
    "X-RateLimit-Remaining": String(rl.remaining),
  };
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Muitas solicitações. Tente novamente em 1 minuto.", retryAfterMs: rl.resetAfterMs },
      { status: 429, headers: { ...baseHeaders, "Retry-After": String(Math.ceil(rl.resetAfterMs / 1000)) } }
    );
  }

  // ── 3. Parse + Zod validate ───────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400, headers: baseHeaders });
  }

  const parsed = QuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: baseHeaders }
    );
  }

  // ── 4. Sanitize (XSS) + content gate (spam/offensive → 400) ────
  const clean = {
    client: {
      name: sanitizeText(parsed.data.client.name, 120),
      city: sanitizeText(parsed.data.client.city, 120),
      phone: sanitizeText(parsed.data.client.phone, 40),
      notes: sanitizeText(parsed.data.client.notes, 1000),
    },
    items: parsed.data.items.map((it) => ({
      equipmentId: sanitizeText(it.equipmentId, 80),
      name: sanitizeText(it.name, 120),
      qty: it.qty,
      note: sanitizeText(it.note ?? "", 300),
    })),
  };

  const haystack = [clean.client.name, clean.client.city, clean.client.notes, ...clean.items.map((i) => `${i.name} ${i.note}`)].join("\n");
  const violation = contentViolation(haystack);
  if (violation === "spam") {
    return NextResponse.json({ error: "Conteúdo bloqueado pelo filtro anti-spam." }, { status: 400, headers: baseHeaders });
  }
  if (violation === "offensive") {
    return NextResponse.json({ error: "Conteúdo inadequado detectado." }, { status: 400, headers: baseHeaders });
  }

  // ── 5. Persist (parameterized query in production) ─────────────
  // TODO: insert via parameterized query / ORM (Prisma Drizzle):
  //   await db.insert(quotes).values({ ...clean, ip: hashedIp, createdAt: new Date() })
  // Never interpolate user input into raw SQL. Log without PII overflow.
  const quoteId = `SF-${Date.now().toString(36).toUpperCase()}`;
  console.log(`[quote] ${quoteId} | items=${clean.items.length} | city=${clean.client.city}`);

  return NextResponse.json(
    { ok: true, quoteId, message: "Orçamento registrado. Conclua no WhatsApp." },
    { status: 201, headers: baseHeaders }
  );
}
