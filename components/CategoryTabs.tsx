"use client";

import { motion } from "framer-motion";
import { LayoutGrid, StretchHorizontal, Flame, Dumbbell, Building2 } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-data";

const ICONS: Record<string, typeof LayoutGrid> = {
  LayoutGrid,
  StretchHorizontal,
  Flame,
  Dumbbell,
  Building2,
};

export default function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Categorias de equipamentos"
      className="glass sticky top-[68px] z-30 -mx-4 flex gap-2 overflow-x-auto p-2 md:mx-0 md:flex-wrap md:rounded-2xl"
    >
      {CATEGORIES.map((c) => {
        const Icon = ICONS[c.icon] ?? LayoutGrid;
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(c.id)}
            className={`relative flex min-h-[48px] shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider transition-colors md:text-sm ${
              isActive ? "text-white" : "text-steel-500 hover:text-steel-100"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="categoryIndicator"
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="absolute inset-0 rounded-xl border border-crimson-600/60 bg-gradient-to-b from-crimson-600 to-crimson-900 shadow-crimson-glow"
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{c.label}</span>
              <span className="sm:hidden">{c.short}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-steel-500"
                }`}
              >
                {c.id === "all" ? counts.all : counts[c.id] ?? 0}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
