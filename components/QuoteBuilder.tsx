"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Minus, Plus, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { Equipment } from "@/lib/catalog-data";
import { buildWhatsAppUrl, type QuoteItem } from "@/lib/whatsapp";
import { sanitizeText } from "@/lib/sanitize";

export interface Selection extends QuoteItem {}

export default function QuoteBuilder({
  open,
  onClose,
  items,
  setItems,
}: {
  open: boolean;
  onClose: () => void;
  items: Selection[];
  setItems: (items: Selection[]) => void;
}) {
  const [client, setClient] = useState({ name: "", city: "", phone: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const updateQty = (id: string, delta: number) =>
    setItems(
      items
        .map((it) => (it.equipment.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );

  const waUrl = buildWhatsAppUrl(items, client);

  async function submitServerQuote() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const payload = {
        client: {
          name: sanitizeText(client.name, 120),
          city: sanitizeText(client.city, 120),
          phone: sanitizeText(client.phone, 40),
          notes: sanitizeText(client.notes, 1000),
        },
        items: items.map((it) => ({
          equipmentId: it.equipment.id,
          name: it.equipment.name,
          qty: it.qty,
          note: sanitizeText(it.note ?? "", 300),
        })),
      };
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Falha HTTP ${res.status}`);
      }
      setStatus("sent");
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-red-900/40 bg-neutral-950"
            role="dialog"
            aria-label="Montar orçamento"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-crimson-500">Sousa Fitness</p>
                <h2 className="font-display text-xl font-extrabold text-white">Seu Orçamento ({items.length})</h2>
              </div>
              <button onClick={onClose} aria-label="Fechar orçamento" className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-steel-500">
                  Nenhum equipamento selecionado. Toque em <strong className="text-white">+</strong> nos cards do catálogo.
                </div>
              )}
              {items.map((it) => (
                <div key={it.equipment.id} className="glass rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-sm font-bold text-white">{it.equipment.name}</p>
                      <p className="text-xs text-steel-500">{it.equipment.priceHint}</p>
                    </div>
                    <button onClick={() => updateQty(it.equipment.id, -it.qty)} aria-label="Remover item" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-steel-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(it.equipment.id, -1)} aria-label="Diminuir quantidade" className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-white">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-display font-extrabold text-white">{it.qty}</span>
                      <button onClick={() => updateQty(it.equipment.id, 1)} aria-label="Aumentar quantidade" className="grid h-12 w-12 place-items-center rounded-xl border border-crimson-600/50 bg-crimson-900/30 text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="glass rounded-2xl space-y-3 p-4">
                <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Seus dados</p>
                {(
                  [
                    ["name", "Nome completo", "Ex: Carlos Sousa"],
                    ["city", "Cidade / UF", "Ex: São Paulo / SP"],
                    ["phone", "WhatsApp", "Ex: (63) 9114-5676"],
                  ] as const
                ).map(([k, label, ph]) => (
                  <label key={k} className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">{label}</span>
                    <input
                      value={client[k]}
                      onChange={(e) => setClient({ ...client, [k]: e.target.value })}
                      placeholder={ph}
                      maxLength={120}
                      className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">Observações (medidas, prazo, entrega)</span>
                  <textarea
                    value={client.notes}
                    onChange={(e) => setClient({ ...client, notes: e.target.value })}
                    placeholder="Ex: Box de 200m², preciso de rig + 300kg anilhas até março."
                    rows={3}
                    maxLength={1000}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                  />
                </label>
              </div>

              {status === "error" && (
                <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
                  {errorMsg} — verifique os campos ou tente em 1 minuto (anti-spam).
                </p>
              )}
              {status === "sent" && (
                <p role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
                  Orçamento registrado com segurança. Abrimos seu WhatsApp para concluir.
                </p>
              )}
            </div>

            <div className="space-y-2 border-t border-white/5 p-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={items.length === 0 || status === "sending"}
                onClick={submitServerQuote}
                className="btn-crimson w-full disabled:opacity-40"
              >
                {status === "sending" ? "Validando..." : <><Send className="h-4 w-4" /> Validar & Enviar no WhatsApp</>}
              </motion.button>
              <a href={items.length ? waUrl : "#"} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full text-xs">
                <MessageCircle className="h-4 w-4" /> Pular validação — ir direto ao WhatsApp
              </a>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-steel-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Validado com Zod · Sanitizado anti-XSS · Rate-limit 5/min
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

