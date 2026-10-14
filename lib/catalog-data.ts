export type CategoryId = "pilates" | "crossfit" | "musculacao" | "academias";

export interface Category {
  id: CategoryId | "all";
  label: string;
  short: string;
  icon: string; // lucide icon key resolved in component
  tagline: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: CategoryId;
  specs: string[];
  buildBadge: string;
  priceHint: string;
  image: string;
  rating: number;
  tag?: "BEST-SELLER" | "HEAVY DUTY" | "NOVO" | "PRO";
  power: string; // e.g. "Suporta 300kg"
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "556391145676";

export const CATEGORIES: Category[] = [
  { id: "all", label: "Todos", short: "Todos", icon: "LayoutGrid", tagline: "Catálogo completo" },
  { id: "pilates", label: "Pilates", short: "Pilates", icon: "StretchHorizontal", tagline: "Reformers & acessórios studio" },
  { id: "crossfit", label: "Crossfit & Funcional", short: "Crossfit", icon: "Flame", tagline: "Rigs, boxes & cardio HIIT" },
  { id: "musculacao", label: "Musculação Heavy Duty", short: "Musculação", icon: "Dumbbell", tagline: "Máquinas articuladas industriais" },
  { id: "academias", label: "Academias Completas", short: "Academias", icon: "Building2", tagline: "Projetos turnkey 50–500m²" },
];

export const CATALOG: Equipment[] = [
  {
    id: "reformer-pro-aero",
    name: "Reformer Pro Aero Pilates",
    category: "pilates",
    specs: ["Estrutura alumínio aeronáutico", "5 molas alemãs reguláveis", "Carrinho silent-glide 98cm"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "Sob consulta",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&auto=format&fit=crop",
    rating: 4.9,
    tag: "BEST-SELLER",
    power: "Suporta 180kg",
  },
  {
    id: "cadillac-trapeze",
    name: "Cadillac Trapeze Table Elite",
    category: "pilates",
    specs: ["Tubos 50x50mm parede 2mm", "Estofado courvin náutico HD", "Kit completo molas + trapézio"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "Sob consulta",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop",
    rating: 4.8,
    tag: "PRO",
    power: "Suporta 200kg",
  },
  {
    id: "rig-cross-6x4",
    name: "Rig Crossfit 6x4m Modular",
    category: "crossfit",
    specs: ["Colunas 80x80mm chapa 3mm", "12 estações + monkey bar", "Pintura black matte + vermelho"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "A partir de R$ 18.900",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop",
    rating: 5.0,
    tag: "HEAVY DUTY",
    power: "Suporta 450kg/estação",
  },
  {
    id: "box-plyo-pro",
    name: "Caixa Pliométrica Pro 3-em-1",
    category: "crossfit",
    specs: ["Compensado naval 20mm", "Faces 50/60/75cm antiderrapantes", "Cantos reforçados em aço"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "R$ 890",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=900&q=80&auto=format&fit=crop",
    rating: 4.7,
    power: "Suporta 250kg",
  },
  {
    id: "leg-press-45",
    name: "Leg Press 45° Industrial",
    category: "musculacao",
    specs: ["Chassi 100x50mm reforçado", "Rolamentos blindados NSK", "Suporte 480kg anilhas"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "A partir de R$ 9.700",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80&auto=format&fit=crop",
    rating: 5.0,
    tag: "HEAVY DUTY",
    power: "Suporta 480kg",
  },
  {
    id: "smith-articulado",
    name: "Smith + Cross Over Articulado",
    category: "musculacao",
    specs: ["Guias cromadas 30mm", "2 torres 100kg cada", "Polias aeronáuticas blindadas"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "A partir de R$ 14.500",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80&auto=format&fit=crop",
    rating: 4.9,
    tag: "NOVO",
    power: "Suporta 350kg",
  },
  {
    id: "kit-academia-150m",
    name: "Academia Completa 150m² Turnkey",
    category: "academias",
    specs: ["32 máquinas + cardio + peso livre", "Projeto 3D + layout técnico", "Instalação e garantia 5 anos"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "Projeto sob medida",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&auto=format&fit=crop",
    rating: 5.0,
    tag: "PRO",
    power: "Até 400 alunos/dia",
  },
  {
    id: "kit-studio-boutique",
    name: "Studio Boutique 80m²",
    category: "academias",
    specs: ["6 reformers + acessórios", "Identidade visual + piso", "Treinamento de equipe incluso"],
    buildBadge: "Aço Carbono / Pintura Eletrostática",
    priceHint: "Projeto sob medida",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=900&q=80&auto=format&fit=crop",
    rating: 4.9,
    tag: "NOVO",
    power: "Até 120 alunos/dia",
  },
];
