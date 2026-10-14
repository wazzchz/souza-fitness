import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sousa Fitness — Equipamentos Heavy Duty | Pilates, Crossfit, Musculação",
  description:
    "Catálogo industrial Sousa Fitness: Reformers Pilates, Rigs Crossfit, Musculação Heavy Duty e Academias Completas turnkey. Aço carbono, pintura eletrostática. Solicite orçamento no WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Preload LCP hero image — 0% CLS, instant paint */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop"
          fetchPriority="high"
        />
      </head>
      <body className="font-sans min-h-screen bg-pitch text-steel-100 antialiased">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-red-radial" />
          <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
