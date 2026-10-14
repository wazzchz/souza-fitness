"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Flame,
  Factory,
  Ruler,
  Truck,
  MessageCircle,
  Send,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import EquipmentCard from "@/components/EquipmentCard";
import QuoteBuilder, { type Selection } from "@/components/QuoteBuilder";
import { CATALOG, CATEGORIES, type Equipment } from "@/lib/catalog-data";
import { sanitizeText, contentViolation } from "@/lib/sanitize";

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const DIFFERENTIALS = [
  {
    icon: Factory,
    title: "Fábrica Própria",
    desc: "Solda MIG industrial, corte a laser e pintura eletrostática em linha própria. Sem terceirização.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia Estrutural 5 Anos",
    desc: "Chassi em aço carbono com parede reforçada. Suporte técnico vitalício e reposição de peças.",
  },
  {
    icon: Ruler,
    title: "Projeto 3D Gratuito",
    desc: "Layout técnico do seu espaço com fluxo de treino, elétrica e paginação de piso. Entrega em 48h.",
  },
  {
    icon: Truck,
    title: "Entrega + Montagem Brasil",
    desc: "Logística própria com equipe de montagem certificada. Instalação limpa em até 5 dias úteis.",
  },
];

const PROJECTS = [
  {
    name: "BOX IRONHOUSE — São Paulo / SP",
    meta: "320m² · Rig 6x4 + 280kg anilhas + cardio",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&auto=format&fit=crop",
    result: "+38% retenção em 6 meses",
  },
  {
    name: "STUDIO VITALLE PILATES — Campinas / SP",
    meta: "90m² · 6 Reformers Pro Aero + Cadillac",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&auto=format&fit=crop",
    result: "Lotação máxima em 90 dias",
  },
  {
    name: "ACADEMIA TITANIUM — Belo Horizonte / MG",
    meta: "450m² turnkey · 32 máquinas heavy duty",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop",
    result: "400 alunos no 1º trimestre",
  },
];

export default function HomePage() {
  const [category, setCategory] = useState<string>("all");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: CATALOG.length };
    for (const cat of CATEGORIES) {
      if (cat.id === "all") continue;
      c[cat.id] = CATALOG.filter((e) => e.category === cat.id).length;
    }
    return c;
  }, []);

  const filtered = useMemo(
    () => (category === "all" ? CATALOG : CATALOG.filter((e) => e.category === category)),
    [category]
  );

  const addToQuote = (equipment: Equipment) => {
    setSelections((prev) => {
      const found = prev.find((p) => p.equipment.id === equipment.id);
      if (found) {
        return prev.map((p) => (p.equipment.id === equipment.id ? { ...p, qty: Math.min(p.qty + 1, 100) } : p));
      }
      return [...prev, { equipment, qty: 1 }];
    });
  };

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setContactStatus("sending");
    setContactError("");
    // Client-side pre-clean (server re-validates — source of truth)
    const payload = {
      name: sanitizeText(contact.name, 120),
      email: sanitizeText(contact.email, 160),
      phone: sanitizeText(contact.phone, 40),
      message: sanitizeText(contact.message, 2000),
    };
    if (contentViolation(`${payload.name}\n${payload.message}`)) {
      setContactStatus("error");
      setContactError("Conteúdo bloqueado pelo filtro de segurança.");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Falha HTTP ${res.status}`);
      }
      setContactStatus("sent");
      setContact({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setContactStatus("error");
      setContactError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }

  return (
    <>
      <Navbar quoteCount={selections.reduce((a, s) => a + s.qty, 0)} onOpenQuote={() => setQuoteOpen(true)} />

      <main>
        <Hero onExplore={() => setCategory("all")} />

        {/* ── Marquee strip ─────────────────────────────────── */}
        <div className="overflow-hidden border-y border-red-900/40 bg-crimson-900/20 py-3 backdrop-blur-xl">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-8 whitespace-nowrap font-display text-xs font-extrabold uppercase tracking-[0.3em] text-red-200"
          >
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["Aço Carbono", "Pintura Eletrostática", "Heavy Duty", "Garantia 5 Anos", "Projetos Turnkey", "Entrega Brasil"].map(
                (t, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-8">
                    {t} <Flame className="h-4 w-4 text-crimson-600" />
                  </span>
                )
              )
            )}
          </motion.div>
        </div>

        {/* ── Catalog ───────────────────────────────────────── */}
        <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-500">Catálogo Industrial 2026</p>
            <h2 className="section-title mt-2">
              EQUIPAMENTOS QUE <span className="text-crimson-600">AGUENTAM O TRILHO.</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-steel-300">
              Selecione a categoria, adicione ao orçamento e receba proposta comercial no WhatsApp em minutos.
              Todos os itens com selo de construção <strong className="text-white">Aço Carbono / Pintura Eletrostática</strong>.
            </p>
          </motion.div>

          <div className="mt-8">
            <CategoryTabs active={category} onChange={setCategory} counts={counts} />
          </div>

          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((eq, i) => (
                <EquipmentCard key={eq.id} equipment={eq} index={i} onAdd={addToQuote} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="mt-8 rounded-2xl border border-dashed border-white/10 p-8 text-center text-steel-500">
              Nenhum equipamento nesta categoria ainda.
            </p>
          )}
        </section>

        {/* ── Diferenciais ──────────────────────────────────── */}
        <section id="diferenciais" className="scroll-mt-24 border-y border-red-900/30 bg-neutral-950/60 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-500">Por que Sousa Fitness</p>
              <h2 className="section-title mt-2">PADRÃO NIVEL <span className="text-crimson-600">INDUSTRIAL.</span></h2>
            </motion.div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIFFERENTIALS.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.08, 0.3) }}
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-3xl p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-b from-crimson-600 to-crimson-900 shadow-crimson-glow">
                    <d.icon className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight text-white">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-300">{d.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust numbers */}
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["480kg", "Carga máxima testada"],
                ["40+", "Academias entregues"],
                ["5 ANOS", "Garantia estrutural"],
                ["48H", "Projeto 3D gratuito"],
              ].map(([k, v]) => (
                <div key={k} className="glass-strong rounded-2xl p-5 text-center">
                  <p className="font-display text-3xl font-extrabold text-white">
                    {k}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-steel-500">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projetos entregues ────────────────────────────── */}
        <section id="projetos" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-500">Cases reais</p>
            <h2 className="section-title mt-2">PROJETOS QUE <span className="text-crimson-600">FATURAM.</span></h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <motion.article
                key={p.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: Math.min(i * 0.08, 0.3) }}
                whileHover={{ scale: 1.02 }}
                className="glass group overflow-hidden rounded-3xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  <span className="badge-crimson absolute left-4 top-4">
                    <Award className="h-3.5 w-3.5" /> Entregue
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-extrabold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-steel-500">{p.meta}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> {p.result}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Contato / Projeto sob medida ──────────────────── */}
        <section id="contato" className="scroll-mt-24 border-t border-red-900/30 bg-neutral-950/60 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-500">Projeto sob medida</p>
              <h2 className="section-title mt-2">VAMOS MONTAR SUA <span className="text-crimson-600">ACADEMIA?</span></h2>
              <p className="mt-4 max-w-md leading-relaxed text-steel-300">
                Envie as medidas do espaço e receba layout 3D + proposta comercial em até 48h. Ou chame direto no WhatsApp.
              </p>
              <div className="mt-6 space-y-3 text-sm text-steel-300">
                <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-crimson-600" /> Atendemos todo o Brasil — fábrica + montagem própria</p>
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-crimson-600" /> (63) 9114-5676 · seg–sáb 8h–19h</p>
                <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-crimson-600" /> Resposta comercial em até 1 dia útil</p>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/556391145676?text=Ol%C3%A1!%20Quero%20um%20projeto%20sob%20medida%20Sousa%20Fitness."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-crimson mt-8"
              >
                <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
              </motion.a>
            </motion.div>

            <motion.form
              onSubmit={submitContact}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="glass-strong space-y-4 rounded-3xl p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">Nome</span>
                  <input
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="Seu nome"
                    className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">WhatsApp</span>
                  <input
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    maxLength={40}
                    placeholder="(63) 9114-5676"
                    className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">E-mail</span>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  required
                  maxLength={160}
                  placeholder="voce@academia.com"
                  className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-500">Sobre o projeto</span>
                <textarea
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  placeholder="Ex: Galpão de 200m² em SP, quero musculação + crossfit, inauguração em junho."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-crimson-600"
                />
              </label>
              {contactStatus === "error" && (
                <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{contactError}</p>
              )}
              {contactStatus === "sent" && (
                <p role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
                  Mensagem enviada com segurança. Retornamos em até 1 dia útil.
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={contactStatus === "sending"}
                className="btn-crimson w-full disabled:opacity-40"
              >
                {contactStatus === "sending" ? "Enviando..." : (<><Send className="h-4 w-4" /> Solicitar Projeto 3D Gratuito</>)}
              </motion.button>
            </motion.form>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-red-900/30 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-display text-sm font-extrabold tracking-tight text-white">
            SOUSA<span className="text-crimson-600">FITNESS</span>
            <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-steel-500">Heavy Duty Equipment</span>
          </p>
          <p className="text-xs text-steel-500">© 2026 Sousa Fitness · Aço carbono · Pintura eletrostática · Garantia 5 anos</p>
        </div>
      </footer>

      {/* ── Floating WhatsApp ───────────────────────────────── */}
      <motion.a
        href="https://wa.me/556391145676"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", damping: 14 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-crimson-600 to-crimson-900 text-white shadow-crimson-glow"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>

      <QuoteBuilder open={quoteOpen} onClose={() => setQuoteOpen(false)} items={selections} setItems={setSelections} />
    </>
  );
}
