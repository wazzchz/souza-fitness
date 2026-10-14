"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Wrench, Star } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-[120px] md:px-8 md:pt-[160px]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
      >
        <div>
          <motion.div variants={item} className="mb-5 flex flex-wrap gap-2">
            <span className="badge-crimson">Aço Carbono Industrial</span>
            <span className="badge-steel">Pintura Eletrostática</span>
            <span className="badge-steel">Garantia 5 anos</span>
          </motion.div>

          <motion.h1 variants={item} className="section-title">
            FORJA SUA
            <span className="block bg-gradient-to-r from-crimson-600 via-red-500 to-crimson-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
              ACADEMIA.
            </span>
            <span className="block text-steel-100">DOMINE O MERCADO.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl leading-relaxed text-steel-300">
            Equipamentos heavy duty para Pilates, Crossfit, Musculação e academias completas turnkey.
            Engenharia brasileira, solda MIG industrial e acabamento premium — do studio boutique ao box de 500m².
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault();
                onExplore();
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-crimson"
            >
              Explorar Catálogo <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} href="#contato" className="btn-ghost">
              Projeto Sob Medida
            </motion.a>
          </motion.div>

          <motion.div variants={item} className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
            {[
              { icon: ShieldCheck, k: "5 ANOS", v: "Garantia estrutural" },
              { icon: Truck, k: "BRASIL", v: "Entrega + montagem" },
              { icon: Wrench, k: "3D FREE", v: "Layout técnico" },
            ].map((s) => (
              <div key={s.k} className="glass rounded-2xl p-4 text-center">
                <s.icon className="mx-auto h-5 w-5 text-crimson-600" />
                <p className="mt-2 font-display text-sm font-extrabold text-white">{s.k}</p>
                <p className="text-xs text-steel-500">{s.v}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero visual — aggressive luxury card */}
        <motion.div
          variants={item}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-strong relative overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop"
              alt="Box Crossfit equipado Sousa Fitness"
              className="h-[320px] w-full object-cover md:h-[460px]"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <div>
                <p className="badge-crimson mb-2">Projeto entregue · 320m²</p>
                <p className="font-display text-xl font-extrabold text-white">BOX IRONHOUSE — SP</p>
                <p className="flex items-center gap-1 text-sm text-steel-300">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 5.0 · 40+ academias entregues
                </p>
              </div>
              <div className="hidden rounded-2xl border border-crimson-600/40 bg-crimson-900/40 px-4 py-3 text-center backdrop-blur-xl sm:block">
                <p className="font-display text-2xl font-extrabold text-white">480<span className="text-sm">kg</span></p>
                <p className="text-[10px] uppercase tracking-widest text-red-200">Carga máxima</p>
              </div>
            </div>
          </motion.div>
          <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-b from-crimson-900/40 to-transparent blur-2xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
