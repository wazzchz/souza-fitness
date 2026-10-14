import { WHATSAPP_NUMBER, formatBRL, type Equipment } from "./catalog-data";

export interface QuoteItem {
  equipment: Equipment;
  qty: number;
  note?: string;
}

export interface ClientInfo {
  name: string;
  city: string;
  phone: string;
  notes: string;
}

/** Sum of priced items (priceValue != null). Returns null when nothing is priced. */
export function estimateTotal(items: QuoteItem[]): number | null {
  let total = 0;
  let priced = false;
  for (const it of items) {
    if (it.equipment.priceValue != null) {
      total += it.equipment.priceValue * it.qty;
      priced = true;
    }
  }
  return priced ? total : null;
}

/** Build a clean, URL-encoded WhatsApp message from quote state. */
export function buildWhatsAppUrl(items: QuoteItem[], client: ClientInfo): string {
  const lines: string[] = [];
  lines.push(`\u{1F3CB} *SOLICITAÇÃO DE ORÇAMENTO — SOUSA FITNESS*`);
  lines.push(`--------------------------------`);
  items.forEach((it, i) => {
    const unit = it.equipment.priceValue != null ? ` — ${formatBRL(it.equipment.priceValue)}/un` : "";
    lines.push(`${i + 1}. *${it.equipment.name}*${unit}`);
    lines.push(`   Categoria: ${it.equipment.category} | Qtd: ${it.qty}`);
    if (it.equipment.priceValue != null && it.qty > 1) {
      lines.push(`   Subtotal: ${formatBRL(it.equipment.priceValue * it.qty)}`);
    }
    if (it.note?.trim()) lines.push(`   Obs: ${it.note.trim()}`);
  });
  const total = estimateTotal(items);
  if (total != null) {
    lines.push(`--------------------------------`);
    lines.push(`\u{1F4B0} *VALOR ESTIMADO: ${formatBRL(total)}*`);
    lines.push(`(estimativa — proposta comercial final sob consulta)`);
  }
  lines.push(`--------------------------------`);
  lines.push(`\u{1F464} Nome: ${client.name || "-"}`);
  lines.push(`\u{1F4CD} Cidade: ${client.city || "-"}`);
  lines.push(`\u{1F4DE} Telefone: ${client.phone || "-"}`);
  if (client.notes.trim()) lines.push(`\u{1F4DD} Detalhes: ${client.notes.trim()}`);
  lines.push(``);
  lines.push(`Aguardo retorno comercial. Obrigado!`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/** Client-side quick CTA for a single equipment card. */
export function singleItemWhatsAppUrl(equipment: Equipment, qty = 1): string {
  return buildWhatsAppUrl(
    [{ equipment, qty }],
    { name: "", city: "", phone: "", notes: `Interesse direto no ${equipment.name} (${equipment.priceHint}).` }
  );
}
