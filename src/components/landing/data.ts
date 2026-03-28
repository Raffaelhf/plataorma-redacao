import { Calendar, CheckSquare, CirclePlay, Crown, Rocket, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tint: string;
};

export type FooterColumn = {
  title: string;
  items: Array<{
    label: string;
    href?: string;
  }>;
};

export type PlanItem = {
  slug: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  name: string;
  cadence: string;
  price: string;
  perMonth: string;
  fit: string;
  highlight?: string;
  badge?: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  featured?: boolean;
  benefits: string[];
};

export const featureItems: FeatureItem[] = [
  {
    title: 'Correção Personalizada',
    description: 'Feedback detalhado, critérios claros e evolução visível a cada envio.',
    icon: CheckSquare,
    color: 'text-[#ff7a29]',
    tint: 'from-[#fff2e8] to-[#fff9f2]',
  },
  {
    title: 'Videoaulas de Apoio',
    description: 'Aulas objetivas para repertório, estrutura e argumentação consistente.',
    icon: CirclePlay,
    color: 'text-[#19b7cc]',
    tint: 'from-[#ebfbff] to-[#f5ffff]',
  },
  {
    title: 'Prática e Simulados',
    description: 'Rotina de treino com temas atuais e simulados pensados para vestibulares.',
    icon: Sparkles,
    color: 'text-[#7d5cff]',
    tint: 'from-[#f2eeff] to-[#faf7ff]',
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Sobre',
    items: [
      { label: 'Início', href: '/' },
      { label: 'Como Funciona', href: '/#recursos' },
      { label: 'Planos', href: '/#planos' },
    ],
  },
  {
    title: 'Recursos',
    items: [{ label: 'Banco de Redações' }, { label: 'Videoaulas' }, { label: 'Temas da Semana' }],
  },
  {
    title: 'Ajuda',
    items: [{ label: 'FAQ' }, { label: 'Contato' }, { label: 'Suporte' }],
  },
  {
    title: 'Institucional',
    items: [
      { label: 'Privacidade e LGPD', href: '/privacidade' },
      { label: 'Política de Cookies', href: '/politica-de-cookies' },
      { label: 'Termos de Serviço', href: '/termos-de-servico' },
    ],
  },
];

export const planItems: PlanItem[] = [
  {
    slug: 'mensal',
    name: 'Mensal',
    cadence: '/mês',
    price: 'R$ 80',
    perMonth: 'Entrada mais leve para começar hoje',
    fit: 'Para experimentar',
    description: 'Bom para conhecer a plataforma e iniciar uma rotina sem assumir ciclo longo.',
    cta: 'Assinar mensal',
    icon: Calendar,
    benefits: ['2 correções por mês', 'Plano de estudo inicial', 'Temas semanais comentados', 'Painel de evolução'],
  },
  {
    slug: 'trimestral',
    name: 'Trimestral',
    cadence: '/trimestre',
    price: 'R$ 218',
    perMonth: 'Equivale a R$ 73/mês',
    fit: 'Para criar consistência',
    highlight: 'Economia de 9% no ciclo',
    description: 'A melhor porta de entrada para ganhar frequência, ritmo e evolução mensurável.',
    cta: 'Escolher trimestral',
    icon: Rocket,
    benefits: ['4 correções por mês', 'Trilha guiada de 90 dias', 'Feedback prioritário', 'Banco extra de repertório'],
  },
  {
    slug: 'semestral',
    name: 'Semestral',
    cadence: '/semestre',
    price: 'R$ 413',
    perMonth: 'Equivale a R$ 69/mês',
    fit: 'Para elevar a nota com método',
    highlight: 'Economia de 14% no ciclo',
    badge: 'Mais escolhido',
    description: 'Formato mais equilibrado entre investimento, acompanhamento e tempo real de evolução.',
    cta: 'Assinar semestral',
    icon: ShieldCheck,
    featured: true,
    benefits: ['5 correções por mês', 'Plano de estudo adaptativo', 'Revisão de repertório', 'Prioridade no suporte'],
  },
  {
    slug: 'anual',
    name: 'Anual',
    cadence: '/ano',
    price: 'R$ 768',
    perMonth: 'Equivale a R$ 64/mês',
    fit: 'Para preparação completa',
    highlight: 'Economia de 20% no ciclo',
    badge: 'Melhor valor',
    description: 'Melhor custo mensal para quem deseja estudar o ano todo com previsibilidade e profundidade.',
    cta: 'Garantir anual',
    icon: Crown,
    benefits: ['6 correções por mês', 'Cronograma anual completo', 'Simulados e revisões', 'Acesso a todos os recursos premium'],
  },
];
