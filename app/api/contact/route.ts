import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeText, contentViolation } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

/** POST /api/contact — hardened contact form endpoint (10 req/min). */

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(8).max(40).optional().default(""),
  message: z.string().min(10).max(2000),
});

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(allow ? { "Access-Control-Allow-Origin": allow, Vary: "Origin" } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin não permitida." }, { status: 403 });
  }

  const rl = rateLimit(req, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Muitas solicitações. Aguarde 1 minuto." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const clean = {
    name: sanitizeText(parsed.data.name, 120),
    email: sanitizeText(parsed.data.email, 160),
    phone: sanitizeText(parsed.data.phone, 40),
    message: sanitizeText(parsed.data.message, 2000),
  };

  const violation = contentViolation(`${clean.name}\n${clean.message}`);
  if (violation) {
    return NextResponse.json({ error: "Conteúdo bloqueado pelo filtro de segurança." }, { status: 400 });
  }

  console.log(`[contact] from=${clean.name} email_len=${clean.email.length}`);
  return NextResponse.json({ ok: true, message: "Mensagem recebida. Retornamos em até 1 dia útil." }, { status: 201 });
}
