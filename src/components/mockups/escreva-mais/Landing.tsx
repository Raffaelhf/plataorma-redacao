import Link from "next/link";
import { ArrowRight, Check, Star, Target, Award, Instagram, Youtube, Linkedin, GraduationCap, TrendingUp, Apple, Play } from "lucide-react";
import { PlatformLogo } from "@/components/branding/platform-logo";
import "./_group.css";

export function Landing() {
  return (
    <div className="em-root min-h-[100dvh] flex flex-col font-['Inter']" style={{ background: "var(--em-bg)" }}>
      {/* 1. HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--em-ink)]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Link href="/" className="flex items-center">
            <PlatformLogo priority className="w-[132px] sm:w-[190px] md:w-[220px]" sizes="(max-width: 639px) 132px, (max-width: 767px) 190px, 220px" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-white/80">
            <a href="#inicio" className="hover:text-[var(--em-green)] transition-colors">Início</a>
            <a href="#conteudo" className="hover:text-[var(--em-green)] transition-colors">Conteúdo</a>
            <a href="#mentores" className="hover:text-[var(--em-green)] transition-colors">Mentores</a>
            <a href="#planos" className="hover:text-[var(--em-green)] transition-colors">Planos</a>
          </nav>
          
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a href="/login" className="hidden text-sm font-semibold transition-colors hover:text-[var(--em-green)] sm:block">Entrar</a>
            <a href="/cadastro" className="em-btn-primary shrink-0 !px-3 !py-2 text-xs sm:!px-5 sm:!py-3 sm:text-sm">
              Começar<span className="hidden sm:inline"> agora</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SPLIT */}
      <section id="inicio" className="w-full overflow-hidden bg-[var(--em-ink)] pt-16 sm:pt-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr] md:gap-12 md:py-24">
          
          {/* Esquerda */}
          <div className="relative z-10 min-w-0 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--em-green)]/20 bg-[var(--em-green)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--em-green)] sm:text-sm">
              <Star className="w-4 h-4 fill-current" /> Redação ENEM 2026
            </div>
            
            <h1 className="em-display-xl max-w-full text-[clamp(2rem,9vw,2.5rem)] leading-[1.02] text-white sm:text-5xl md:text-7xl lg:text-[84px]">
              Encontre o tema <span className="text-[var(--em-ink)] bg-[var(--em-green)] px-2 rounded-lg inline-block transform -rotate-1">perfeito</span><br/> 
              e evolua seu <span className="relative inline-block">
                estilo
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-[var(--em-yellow)]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,20 100,5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
              A plataforma definitiva para você dominar a redação do ENEM, Fuvest e Unicamp com correção inteligente e mentoria de especialistas.
            </p>
            
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:pt-4">
              <a href="/cadastro" className="em-btn-primary w-full justify-center px-6 py-4 text-base sm:w-auto sm:px-8 sm:text-lg">
                Começar agora <ArrowRight className="w-5 h-5" />
              </a>
              <div className="flex items-center justify-center gap-4 px-1 text-sm font-medium text-white/60 sm:justify-start sm:px-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--em-ink)] bg-[var(--em-lavender)]"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--em-ink)] bg-[var(--em-peach)]"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--em-ink)] bg-[var(--em-mint)]"></div>
                </div>
                <span>+15.000<br/>alunos aprovados</span>
              </div>
            </div>
          </div>
          
          {/* Direita: Painel Verde */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] sm:max-w-md md:ml-auto md:aspect-[3/4]">
            {/* Decorações do painel */}
            <div className="em-card-hard group absolute inset-0 overflow-hidden rounded-[28px] bg-[var(--em-green)] !border-2 !border-white/10 sm:rounded-[40px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.32),transparent_26%),radial-gradient(circle_at_86%_82%,rgba(14,15,18,0.18),transparent_34%)]" />
              <div className="pointer-events-none absolute left-6 top-8 h-24 w-24 rounded-full border-[18px] border-white/25 sm:h-32 sm:w-32" />

              {/* Estrela coral gigante de fundo */}
              <div className="em-spin-slow absolute right-5 top-6 text-[var(--em-coral)] opacity-70 sm:right-8 sm:top-8">
                <svg className="h-28 w-28 sm:h-[180px] sm:w-[180px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 8.5L23.5 11.5L14.59 14.5L12 23.5L9.41 14.5L0.5 11.5L9.41 8.5L12 0Z"/>
                </svg>
              </div>
              
              {/* Círculo decorativo */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 border-[24px] border-[var(--em-green-deep)] rounded-full opacity-50"></div>
              
              {/* Foto do estudante */}
              <div className="absolute inset-x-5 bottom-16 z-10 mx-auto max-w-[86%] rotate-[-2deg] rounded-[26px] border-2 border-[var(--em-ink)] bg-white p-2 shadow-[10px_12px_0_0_rgba(14,15,18,0.28)] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.015] sm:inset-x-8 sm:bottom-20 sm:rounded-[32px] sm:p-3">
                <div className="absolute -right-4 -top-4 z-[-1] h-full w-full rounded-[26px] border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] sm:rounded-[32px]" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[var(--em-ink)] bg-[var(--em-cream)] sm:rounded-[26px]">
                  <img 
                    src="/__mockup/images/escreva-mais/student.png" 
                    alt="Estudante lendo um livro"
                    className="h-full w-full object-cover object-center contrast-[1.04] saturate-[1.08]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_38%,rgba(14,15,18,0.18)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-3 top-3 h-16 rounded-full bg-white/18 blur-xl" />
                </div>
              </div>
              
              {/* Badge flutuante */}
              <div className="em-card-hard em-float absolute bottom-4 left-3 z-20 flex max-w-[calc(100%-24px)] items-center gap-3 rounded-2xl bg-white p-3 sm:bottom-8 sm:left-[-20px] sm:p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--em-mint)] text-[var(--em-green-deep)] sm:h-12 sm:w-12">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--em-ink)]">Nota 980+</div>
                  <div className="text-xs text-[var(--em-text-soft)]">Média dos alunos</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. FRASE DE FOCO */}
      <section className="overflow-hidden border-y border-[var(--em-border)] bg-white py-6 sm:py-8">
        <div className="animate-marquee flex w-max items-center gap-10 px-6 font-['Plus_Jakarta_Sans'] text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--em-text-mute)] opacity-70 sm:gap-16 sm:text-lg sm:tracking-[0.18em]">
          <span className="shrink-0">Formação em redação com metodologia, repertório e foco no ENEM.</span>
          <span className="shrink-0">Formação em redação com metodologia, repertório e foco no ENEM.</span>
          <span className="shrink-0">Formação em redação com metodologia, repertório e foco no ENEM.</span>
          <span className="shrink-0">Formação em redação com metodologia, repertório e foco no ENEM.</span>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 24s linear infinite; }
        `}} />
      </section>

      {/* 4. SEÇÃO FEATURES PASTEL */}
      <section className="mx-auto w-full max-w-[900px] px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center md:mb-12">
          <h2 className="em-display text-[2rem] text-[var(--em-ink)] sm:text-[2.35rem] md:text-[2.75rem]">
            Conquiste seus <span className="relative">
              objetivos
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[var(--em-green)]" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 Q50,20 100,10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </span> com a Escreva Mais
          </h2>
          <p className="text-base font-medium text-[var(--em-text-soft)] sm:text-lg">Método focado em resultados reais para os vestibulares mais concorridos do país.</p>
        </div>
        
        <div className="mx-auto grid max-w-[840px] gap-5 md:grid-cols-3">
          <div className="em-card-hard flex flex-col items-start gap-4 bg-[var(--em-mint)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-white text-[var(--em-green-deep)] shadow-[3px_3px_0_0_#0E0F12]">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-3 font-['Plus_Jakarta_Sans'] text-xl font-extrabold leading-tight text-[var(--em-ink)]">Aprenda as técnicas mais atuais</h3>
              <p className="text-sm font-medium leading-6 text-[var(--em-ink-soft)]/80">Modelos de redação validados pelas bancas do ENEM e Fuvest, atualizados anualmente.</p>
            </div>
          </div>
          
          <div className="em-card-hard flex flex-col items-start gap-4 bg-[var(--em-peach)] p-6 md:translate-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-white text-[var(--em-peach-deep)] shadow-[3px_3px_0_0_#0E0F12]">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-3 font-['Plus_Jakarta_Sans'] text-xl font-extrabold leading-tight text-[var(--em-ink)]">Esteja pronto para a prova</h3>
              <p className="text-sm font-medium leading-6 text-[var(--em-ink-soft)]/80">Simulados semanais com temas inéditos e correção detalhada nos 5 critérios.</p>
            </div>
          </div>
          
          <div className="em-card-hard flex flex-col items-start gap-4 bg-[var(--em-lavender)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-white text-[var(--em-lavender-deep)] shadow-[3px_3px_0_0_#0E0F12]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-3 font-['Plus_Jakarta_Sans'] text-xl font-extrabold leading-tight text-[var(--em-ink)]">Conquiste sua vaga</h3>
              <p className="text-sm font-medium leading-6 text-[var(--em-ink-soft)]/80">Análise de desempenho e histórico de evolução para você chegar no 1000 com segurança.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO CURSOS POPULARES */}
      <section id="conteudo" className="border-y border-[var(--em-border)] bg-[var(--em-cream)] px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="em-chip bg-[var(--em-green-soft)] text-[var(--em-green-deep)] border-[var(--em-green)] mb-4">
                <Star className="w-4 h-4 fill-current" /> Conteúdo Exclusivo
              </div>
              <h2 className="em-display text-3xl text-[var(--em-ink)] sm:text-4xl md:text-5xl">Nossos programas de <span className="text-[var(--em-green-deep)]">formação</span></h2>
            </div>
            <a href="/cadastro" className="em-btn-primary">Explorar todos os cursos</a>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                {
                  title: "Clube do Livro",
                  description: "Leitura orientada para ampliar repertório sociocultural e fortalecer seus argumentos.",
                  mentor: "Equipe Escreva Mais",
                  price: "R$ 40",
                  color: "var(--em-mint)",
                  img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
                },
                {
                  title: "Redação ENEM: prática orientada",
                  description: "Propostas semanais, estrutura dissertativa e estratégias para evoluir com constância.",
                  mentor: "Profª. Júlia Silva",
                  price: "R$ 45",
                  color: "var(--em-yellow)",
                  img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
                },
                {
                  title: "Monitoria Individualizada",
                  description: "Acompanhamento personalizado para corrigir dificuldades e orientar seu plano de estudo.",
                  mentor: "Prof. Rafael Costa",
                  price: "R$ 70",
                  color: "var(--em-coral)",
                  img: "/images/escreva-mais/monitoria-individualizada.png",
                },
              ].map((course, i) => (
              <div key={i} className="em-card-hard p-4 flex flex-col group cursor-pointer bg-white">
                <div className="w-full aspect-[4/3] rounded-xl mb-6 relative overflow-hidden border-2 border-[var(--em-ink)] bg-[var(--em-bg-alt)]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${course.img})`, filter: "contrast(1.1) saturate(1.2)" }}></div>
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundColor: course.color }}></div>
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold text-[var(--em-ink)] border-2 border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                    {course.price}
                  </div>
                </div>
                <div className="px-2 flex-1 flex flex-col">
                  <h3 className="mb-3 font-['Plus_Jakarta_Sans'] text-xl font-bold leading-tight text-[var(--em-ink)] transition-colors group-hover:text-[var(--em-green-deep)]">{course.title}</h3>
                  <p className="mb-5 text-sm font-medium leading-6 text-[var(--em-text-soft)]">{course.description}</p>
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[var(--em-border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--em-ink)] text-white grid place-items-center font-bold text-xs">
                      {course.mentor.split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                    <span className="text-sm font-semibold text-[var(--em-text-soft)]">{course.mentor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-12">
            <div className="w-8 h-2 rounded-full bg-[var(--em-ink)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--em-border-strong)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--em-border-strong)]"></div>
          </div>
        </div>
      </section>

      {/* 6. SEÇÃO MENTORES SPLIT */}
      <section id="mentores" className="mx-auto w-full max-w-[920px] overflow-hidden px-4 py-14 sm:px-6 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-8">
          <div className="order-2 min-w-0 space-y-8 lg:order-1">
            <div className="em-chip bg-[var(--em-yellow-soft)] border-[var(--em-yellow)] text-[var(--em-ink)]">
              <Award className="w-4 h-4" /> Qualidade Garantida
            </div>
            <h2 className="em-display max-w-full text-[2rem] leading-[1.02] text-[var(--em-ink)] sm:text-[2.35rem] md:text-[2.75rem]">
              Tenha experiência com mentores <span className="bg-[var(--em-yellow)] px-2 rounded-lg">qualificados</span>
            </h2>
            <p className="max-w-md text-base font-medium leading-7 text-[var(--em-text-soft)]">
              Nossa equipe é formada por corretores oficiais das principais bancas do país. Aprenda exatamente o que os avaliadores querem ler.
            </p>
            <ul className="space-y-4">
              {['Correção humanizada e detalhada', 'Feedback em áudio e texto', 'Mentoria em vídeo ao vivo'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-semibold text-[var(--em-ink)]">
                  <div className="w-6 h-6 rounded-full bg-[var(--em-green)] text-[var(--em-ink)] flex items-center justify-center border border-[var(--em-ink)]">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <a href="/cadastro" className="em-btn-primary">Conhecer equipe</a>
            </div>
          </div>
          
          <div className="relative order-1 mx-auto h-[340px] w-full max-w-[460px] pb-12 sm:h-[380px] sm:pb-16 lg:order-2 lg:h-[380px] lg:max-w-none lg:pb-0">
            <div className="em-card-hard absolute inset-x-0 top-0 h-[270px] overflow-hidden rounded-[28px] bg-[var(--em-peach)] !border-2 !p-0 sm:h-[330px] sm:rotate-2 sm:rounded-[32px] lg:inset-0 lg:h-auto">
              <img 
                src="/__mockup/images/escreva-mais/mentors-team.png" 
                alt="Equipe de mentores" 
                className="h-full w-full object-cover opacity-90 mix-blend-luminosity sm:-rotate-2 sm:scale-110"
              />
            </div>
            
            {/* Card Flutuante */}
            <div className="em-card-hard absolute bottom-0 left-3 right-3 z-20 rounded-[24px] bg-white p-5 sm:left-6 sm:right-auto sm:w-[260px] sm:p-5 lg:-bottom-5 lg:-left-2">
              <h4 className="font-extrabold text-[var(--em-ink)] mb-4 font-['Plus_Jakarta_Sans']">Nossos top mentores</h4>
              <div className="space-y-4">
                {[
                  { name: "Profª. Júlia Silva", area: "Redação ENEM", bg: "bg-[var(--em-mint)]" },
                  { name: "Prof. Lucas Mendes", area: "Fuvest / Unicamp", bg: "bg-[var(--em-lavender)]" },
                  { name: "Profª. Beatriz Lima", area: "Gramática e Estilo", bg: "bg-[var(--em-peach)]" }
                ].map((mentor, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${mentor.bg} border-2 border-[var(--em-ink)] grid place-items-center text-[var(--em-ink)] font-bold text-xs`}>
                      {mentor.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--em-ink)]">{mentor.name}</div>
                      <div className="text-xs font-semibold text-[var(--em-text-soft)]">{mentor.area}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEÇÃO DEPOIMENTOS YELLOW */}
      <section className="bg-[var(--em-ink)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="em-display mb-4 text-3xl text-[var(--em-yellow)] sm:text-4xl md:text-5xl">
              Sucesso & Confiança
            </h2>
            <p className="text-white/70 text-lg">O que dizem os alunos aprovados nas federais</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { text: "A correção detalhada me mostrou exatamente onde eu perdia pontos. Foi fundamental para a minha aprovação.", author: "Pedro Henrique", goal: "Medicina USP", score: "De 720 → 960" },
              { text: "Os modelos de redação me deram a segurança que eu precisava. Cheguei na prova sabendo exatamente a estrutura.", author: "Ana Clara", goal: "Direito UFMG", score: "De 680 → 980" },
              { text: "Os plantões tira-dúvidas salvaram minha vida. Mentores atenciosos que realmente se importam com seu resultado.", author: "João Gabriel", goal: "Engenharia Poli", score: "De 800 → 940" }
            ].map((dep, i) => (
              <div key={i} className="bg-[var(--em-yellow)] p-8 em-card-hard !border-white/20 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex gap-1 text-[var(--em-ink)] mb-6">
                  {[...Array(5)].map((_,j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg font-bold text-[var(--em-ink)] mb-8 leading-snug">&ldquo;{dep.text}&rdquo;</p>
                <div className="flex items-center justify-between border-t border-[var(--em-ink)]/20 pt-6">
                  <div>
                    <div className="font-bold text-[var(--em-ink)]">{dep.author}</div>
                    <div className="text-sm font-semibold text-[var(--em-ink)]/70">{dep.goal}</div>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-[var(--em-ink)] text-xs font-bold shadow-[2px_2px_0_0_#0E0F12]">
                    {dep.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO PLANOS */}
      <section id="planos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="em-display mb-4 text-3xl text-[var(--em-ink)] sm:text-4xl md:text-5xl">
            Escolha seu <span className="bg-[var(--em-green)] px-2 rounded-lg">plano</span>
          </h2>
          <p className="text-lg text-[var(--em-text-soft)] font-medium">Invista no seu futuro. Cancele quando quiser.</p>
        </div>
        
        <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Mensal", price: "R$ 80", period: "/mês", desc: "Acesso básico", color: "bg-white" },
            { title: "Trimestral", price: "R$ 218", period: "/trim", desc: "Foco intensivo", color: "bg-white" },
            { title: "Semestral", price: "R$ 413", period: "/sem", desc: "Preparação completa", color: "bg-[var(--em-mint)]", badge: "Mais escolhido" },
            { title: "Anual", price: "R$ 768", period: "/ano", desc: "O ano todo com você", color: "bg-[var(--em-peach)]", badge: "Melhor valor" }
          ].map((plan, i) => (
            <div key={i} className={`p-8 em-card-hard flex flex-col h-full relative ${plan.color} ${plan.badge ? 'lg:-translate-y-4' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--em-ink)] text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap shadow-md">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-[var(--em-ink)]">{plan.title}</h3>
              <p className="text-sm font-semibold text-[var(--em-ink)]/60 mb-6">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-[var(--em-ink)] font-['Plus_Jakarta_Sans']">{plan.price}</span>
                <span className="text-[var(--em-ink)]/60 font-semibold">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['2 redações p/ mês', 'Correção em 48h', 'Acesso às aulas base'].map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold text-[var(--em-ink)]">
                    <Check className="w-4 h-4 text-[var(--em-ink)]" strokeWidth={3} />
                    {feat}
                  </li>
                ))}
              </ul>
              
              <a href={`/cadastro?plan=${['mensal', 'trimestral', 'semestral', 'anual'][i]}`} className={`w-full ${plan.badge ? 'em-btn-primary' : 'em-btn-primary bg-white'} justify-center`}>
                Assinar {plan.title}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA APP */}
      <section className="mx-auto mb-16 w-full max-w-6xl px-4 py-12 sm:px-6 md:mb-24 md:py-16">
        <div className="em-card-hard relative flex flex-col items-center gap-10 overflow-hidden rounded-[28px] bg-[var(--em-ink)] p-6 !shadow-[8px_8px_0_0_#2BD37B] sm:p-10 md:flex-row md:gap-12 md:rounded-[40px] md:p-16">
          {/* Noise background overlay */}
          <div className="absolute inset-0 em-noise opacity-20"></div>
          
          <div className="relative z-10 flex-1 space-y-8 text-center md:text-left">
            <h2 className="em-display text-3xl text-white sm:text-4xl md:text-5xl">
              Baixe o app e estude de <span className="text-[var(--em-yellow)]">onde estiver</span>
            </h2>
            <p className="text-white/70 text-lg">Envie redações por foto, assista videoaulas offline e receba notificações das suas correções.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="/cadastro" className="em-btn-primary justify-center border-2 !bg-white px-6 py-3 !text-[var(--em-ink)]">
                <Apple className="w-6 h-6" /> App Store
              </a>
              <a href="/cadastro" className="em-btn-primary justify-center border-2 !bg-white px-6 py-3 !text-[var(--em-ink)]">
                <Play className="w-6 h-6" /> Google Play
              </a>
            </div>
          </div>
          
          <div className="relative z-10 flex h-[300px] w-[220px] rotate-3 flex-col rounded-[32px] border-4 border-[var(--em-ink)] bg-[var(--em-mint)] p-4 shadow-[8px_8px_0_0_#0E0F12] sm:h-[320px] sm:w-[240px]">
             {/* Mockup simplificado de celular */}
             <div className="w-16 h-1 bg-[var(--em-ink)] rounded-full mx-auto mb-4"></div>
             <div className="bg-white flex-1 rounded-2xl border-2 border-[var(--em-ink)] p-4 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[var(--em-green)] border-2 border-[var(--em-ink)] mb-4"></div>
                <div className="w-3/4 h-3 bg-[var(--em-bg-alt)] rounded-full mb-2"></div>
                <div className="w-1/2 h-3 bg-[var(--em-bg-alt)] rounded-full mb-8"></div>
                
                <div className="w-full h-24 bg-[var(--em-yellow)] rounded-xl border-2 border-[var(--em-ink)] mb-4"></div>
                <div className="w-full h-16 bg-[var(--em-peach)] rounded-xl border-2 border-[var(--em-ink)]"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[var(--em-ink)] text-[var(--em-text-on-ink)] border-t border-white/10 pt-20 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <PlatformLogo className="w-[190px]" sizes="190px" />
              </div>
              <p className="text-white/60 mb-8 max-w-sm">A plataforma definitiva para você dominar a redação do ENEM e vestibulares de todo o Brasil.</p>
              
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--em-green)] hover:text-[var(--em-ink)] transition-colors border border-white/20">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--em-green)] hover:text-[var(--em-ink)] transition-colors border border-white/20">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--em-green)] hover:text-[var(--em-ink)] transition-colors border border-white/20">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 font-['Plus_Jakarta_Sans']">Sobre</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#inicio" className="hover:text-[var(--em-green)]">Nossa História</a></li>
                <li><a href="#mentores" className="hover:text-[var(--em-green)]">Mentores</a></li>
                <li><a href="/cadastro" className="hover:text-[var(--em-green)]">Carreiras</a></li>
                <li><a href="#conteudo" className="hover:text-[var(--em-green)]">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 font-['Plus_Jakarta_Sans']">Recursos</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-[var(--em-green)]">Temas de Redação</a></li>
                <li><a href="#" className="hover:text-[var(--em-green)]">Simulador ENEM</a></li>
                <li><a href="#" className="hover:text-[var(--em-green)]">Materiais Gratuitos</a></li>
                <li><a href="#" className="hover:text-[var(--em-green)]">Guia de Estudo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 font-['Plus_Jakarta_Sans']">Ajuda</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="/login" className="hover:text-[var(--em-green)]">Central de Ajuda</a></li>
                <li><a href="#planos" className="hover:text-[var(--em-green)]">Planos e Preços</a></li>
                <li><a href="/login" className="hover:text-[var(--em-green)]">Área da plataforma</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div>© 2026 Escreva Mais. Todos os direitos reservados.</div>
            <div className="flex items-center gap-6">
              <a href="/privacidade" className="hover:text-white">Privacidade e LGPD</a>
              <a href="/politica-de-cookies" className="hover:text-white">Cookies</a>
              <a href="/termos-de-servico" className="hover:text-white">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
