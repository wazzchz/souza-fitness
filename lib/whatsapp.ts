import { WHATSAPP_NUMBER, type Equipment } from "./catalog-data";

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

/** Build a clean, URL-encoded WhatsApp message from quote state. */
export function buildWhatsAppUrl(items: QuoteItem[], client: ClientInfo): string {
  const lines: string[] = [];
  lines.push(`\u{1F3CB} *SOLICITAÇÃO DE ORÇAMENTO — SOUSA FITNESS*`);
  lines.push(`--------------------------------`);
  items.forEach((it, i) => {
    lines.push(`${i + 1}. *${it.equipment.name}*`);
    lines.push(`   Categoria: ${it.equipment.category} | Qtd: ${it.qty}`);
    if (it.note?.trim()) lines.push(`   Obs: ${it.note.trim()}`);
  });
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
export function singleItemWhatsAppUrl(equipment: Equipment): string {
  return buildWhatsAppUrl(
    [{ equipment, qty: 1 }],
    { name: "", city: "", phone: "", notes: `Interesse direto no ${equipment.name} (${equipment.priceHint}).` }
  );
}
