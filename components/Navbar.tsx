"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Dumbbell, Menu, X, MessageCircle, FileText } from "lucide-react";

const LINKS = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar({ quoteCount, onOpenQuote }: { quoteCount: number; onOpenQuote: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-red-900/40 bg-neutral-950/80 shadow-[0_0_30px_rgba(153,0,0,0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 md:px-8" aria-label="Navegação principal">
          <a href="#top" className="flex items-center gap-3 min-h-[48px]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-crimson-600 to-crimson-900 shadow-crimson-glow">
              <Dumbbell className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              SOUSA<span className="text-crimson-600">FITNESS</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-steel-500">
                Heavy Duty Equipment
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-steel-300 transition hover:bg-crimson-900/30 hover:text-white min-h-[48px] inline-flex items-center"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenQuote}
              className="btn-crimson !px-4 !py-2 !min-h-[48px] text-xs md:text-sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Orçamento</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white/20 px-1 text-xs font-extrabold">
                {quoteCount}
              </span>
            </motion.button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Abrir menu"
              className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-2 border-l border-red-900/40 bg-neutral-950 p-6 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.06 * i }}
                  className="flex min-h-[48px] items-center rounded-xl border border-white/5 bg-white/5 px-5 font-display text-lg font-bold text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <a href="https://wa.me/556391145676" className="btn-crimson mt-4 w-full">
                <MessageCircle className="h-4 w-4" /> WhatsApp Direto
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
