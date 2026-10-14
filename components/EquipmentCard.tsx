"use client";

import { motion } from "framer-motion";
import { Star, Plus, Minus, MessageCircle, BadgeCheck, Zap } from "lucide-react";
import { useState } from "react";
import type { Equipment } from "@/lib/catalog-data";
import { singleItemWhatsAppUrl } from "@/lib/whatsapp";

const TAG_STYLE: Record<string, string> = {
  "BEST-SELLER": "bg-amber-500/90 text-black",
  "HEAVY DUTY": "bg-crimson-600 text-white shadow-crimson-glow",
  NOVO: "bg-emerald-500 text-black",
  PRO: "bg-steel-100 text-black",
};

export default function EquipmentCard({
  equipment,
  index,
  onAdd,
}: {
  equipment: Equipment;
  index: number;
  onAdd: (e: Equipment, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <motion.article
      layout
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 12, opacity: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass group flex flex-col overflow-hidden rounded-3xl shadow-card transition-shadow hover:shadow-crimson-glow"
    >
      <div className="relative h-52 overflow-hidden md:h-60">
        <img
          src={equipment.image}
          alt={equipment.name}
          loading="lazy"
          width={900}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {equipment.tag && (
            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${TAG_STYLE[equipment.tag]}`}>
              {equipment.tag}
            </span>
          )}
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xl">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {equipment.rating.toFixed(1)}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-red-950/60 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200 backdrop-blur-xl">
          <Zap className="h-3 w-3" /> {equipment.power}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-crimson-500">{equipment.category}</p>
          <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">{equipment.name}</h3>
        </div>

        <ul className="space-y-1.5">
          {equipment.specs.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13px] leading-relaxed text-steel-300">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-crimson-600" /> {s}
            </li>
          ))}
        </ul>

        <p className="badge-steel w-fit">{equipment.buildBadge}</p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-steel-500">Investimento</p>
            <p className="font-display text-base font-extrabold text-white">{equipment.priceHint}</p>
          </div>
          {/* Quantity counter — 48px touch targets */}
          <div className="flex items-center gap-1.5" role="group" aria-label={`Quantidade para ${equipment.name}`}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-crimson-600/60"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span aria-live="polite" className="w-7 text-center font-display text-base font-extrabold text-white">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Aumentar quantidade"
              className="grid h-12 w-12 place-items-center rounded-xl border border-crimson-600/50 bg-crimson-900/30 text-white transition hover:bg-crimson-600"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAdd(equipment, qty)}
            aria-label={`Adicionar ${qty}x ${equipment.name} ao orçamento`}
            className="btn-ghost flex-1 !px-3 text-[11px]"
          >
            <Plus className="h-4 w-4" /> Adicionar {qty > 1 ? `${qty}x` : ""} ao Orçamento
          </motion.button>
        </div>
        <div className="flex gap-2">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={singleItemWhatsAppUrl(equipment, qty)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crimson btn-pulse flex-1 !px-3 text-[11px]"
          >
            <MessageCircle className="h-4 w-4" /> Solicitar Orçamento{qty > 1 ? ` (${qty}x)` : ""}
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
