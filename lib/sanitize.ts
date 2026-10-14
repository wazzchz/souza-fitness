/**
 * Shared sanitization helpers (mirrored client/server).
 * Server is source of truth — client only pre-cleans for UX.
 */

const TAG_RE = /<[^>]*>/g;
const PROTO_RE = /(javascript|data|vbscript)\s*:/gi;
const HANDLER_RE = /\son\w+\s*=\s*(['"]).*?\1/gi;

export function stripHtml(input: string): string {
  return input.replace(TAG_RE, "").replace(HANDLER_RE, "").replace(PROTO_RE, "").trim();
}

export function sanitizeText(input: string, maxLen = 500): string {
  if (typeof input !== "string") return "";
  return stripHtml(input).slice(0, maxLen);
}

/** Lightweight spam / offensive-content gate (server enforces with 400). */
const BLOCKED = [
  /viagra|cialis|casino|bet365|crypto\s*double|free\s*money/i,
  /https?:\/\/\S+\s+https?:\/\/\S+\s+https?:\/\/\S+/i, // 3+ links = spam
  /(\w)\1{9,}/, // char flood
];

const OFFENSIVE = [/puta|caralho|fdp|ot[aá]rio|imbecil/i];

export function contentViolation(text: string): "spam" | "offensive" | null {
  const joined = text.toLowerCase();
  if (OFFENSIVE.some((r) => r.test(joined))) return "offensive";
  if (BLOCKED.some((r) => r.test(joined))) return "spam";
  return null;
}
