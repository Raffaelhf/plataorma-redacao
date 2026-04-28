"use client";

import React, { useState } from "react";
import { 
  PenSquare, 
  CheckCircle2, 
  PlayCircle, 
  Users, 
  Clock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from "lucide-react";
import { Input } from "@/components/mockup-ui/input";
import { Label } from "@/components/mockup-ui/label";
import { Checkbox } from "@/components/mockup-ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/mockup-ui/select";
import "./_group.css";

export function Cadastro() {
  const [role, setRole] = useState<"aluno" | "professor">("aluno");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 5
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = (s: number) => {
    if (s === 0) return "bg-[var(--em-border)]";
    if (s < 3) return "bg-[var(--em-coral)]";
    if (s < 5) return "bg-[var(--em-yellow)]";
    return "bg-[var(--em-green)]";
  };
  
  const getStrengthText = (s: number) => {
    if (s === 0) return "";
    if (s < 3) return "Fraca";
    if (s < 5) return "Média";
    return "Forte";
  };

  return (
    <div className="em-root min-h-screen flex flex-col lg:flex-row font-sans" style={{ background: "var(--em-bg)" }}>
      {/* Left Split — Black Panel */}
      <div className="w-full lg:w-[48%] xl:w-[45%] p-6 md:p-10 lg:p-14 flex flex-col relative overflow-hidden" style={{ background: "var(--em-ink)" }}>
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-12 relative z-20">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-[var(--em-ink)] shadow-[4px_4px_0_0_#000]" style={{ background: "var(--em-green)" }}>
            <PenSquare className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-extrabold tracking-tight text-white">Escreva Mais</span>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center relative z-20 w-full max-w-[500px] mx-auto">
          {/* Decorative Star */}
          <div className="absolute -top-16 -right-16 text-[var(--em-coral)] em-spin-slow opacity-90 pointer-events-none z-0">
            <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <h1 className="em-display text-[40px] md:text-[48px] lg:text-[56px] text-white leading-[1.05] mb-6 relative z-10">
            Sua jornada de redação começa{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-[var(--em-ink)] px-2">aqui.</span>
              <span className="absolute inset-0 top-2 bottom-0 bg-[var(--em-yellow)] -skew-y-2 transform origin-left -z-0"></span>
            </span>
          </h1>
          
          <p className="text-[17px] text-[var(--em-text-on-ink-soft)] mb-10 max-w-[420px] leading-relaxed relative z-10">
            Junte-se a milhares de estudantes brasileiros que alcançaram a nota 1000 com correções detalhadas e planos de estudo focados no que realmente importa.
          </p>

          {/* Feature List in Lime Panel */}
          <div className="p-6 md:p-8 rounded-[32px] border-[2px] border-[var(--em-ink)] shadow-[8px_8px_0_0_#2BD37B] relative overflow-hidden" style={{ background: "var(--em-ink-soft)" }}>
            {/* Decorative spiral/circles inside the panel */}
            <div className="absolute -bottom-16 -right-16 w-56 h-56 border-[24px] border-[var(--em-green)] rounded-full opacity-20 pointer-events-none"></div>
            
            <div className="space-y-3.5 relative z-10">
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-[20px] border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--em-green-soft)] grid place-items-center shrink-0 border border-[var(--em-ink)]/10 shadow-[2px_2px_0_0_#0E0F12]">
                  <Clock className="w-5 h-5 text-[var(--em-green-deep)]" strokeWidth={2.5} />
                </div>
                <div className="text-[15px] font-bold text-white tracking-tight">Correção em até 72h</div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-[20px] border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--em-peach)] grid place-items-center shrink-0 border border-[var(--em-ink)]/10 shadow-[2px_2px_0_0_#0E0F12]">
                  <CheckCircle2 className="w-5 h-5 text-[var(--em-peach-deep)]" strokeWidth={2.5} />
                </div>
                <div className="text-[15px] font-bold text-white tracking-tight">Plano semanal personalizado</div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-[20px] border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--em-lavender)] grid place-items-center shrink-0 border border-[var(--em-ink)]/10 shadow-[2px_2px_0_0_#0E0F12]">
                  <PlayCircle className="w-5 h-5 text-[var(--em-lavender-deep)]" strokeWidth={2.5} />
                </div>
                <div className="text-[15px] font-bold text-white tracking-tight">Acesso a videoaulas</div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-[20px] border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-[14px] bg-[var(--em-rose)] grid place-items-center shrink-0 border border-[var(--em-ink)]/10 shadow-[2px_2px_0_0_#0E0F12]">
                  <Users className="w-5 h-5 text-[var(--em-rose-deep)]" strokeWidth={2.5} />
                </div>
                <div className="text-[15px] font-bold text-white tracking-tight">Comunidade de estudantes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-12 flex justify-between items-end z-20 w-full max-w-[500px] mx-auto">
          <div className="flex items-center gap-3.5 text-[12px] font-extrabold tracking-widest uppercase text-[var(--em-text-on-ink-soft)]">
            <span className="text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--em-green)] text-[var(--em-ink)] grid place-items-center text-[10px] leading-none pt-px shadow-[2px_2px_0_0_#000]">1</span>
              Cadastro
            </span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-[1.5px] border-[var(--em-text-on-ink-soft)] grid place-items-center text-[10px] leading-none pt-px">2</span>
              Plano
            </span>
            <span className="opacity-30">·</span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-[1.5px] border-[var(--em-text-on-ink-soft)] grid place-items-center text-[10px] leading-none pt-px">3</span>
              Pronto
            </span>
          </div>
        </div>
      </div>

      {/* Right Split — Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative overflow-y-auto" style={{ background: "var(--em-bg)" }}>
        {/* Subtle background noise */}
        <div className="em-noise"></div>
        
        <div className="w-full max-w-[480px] relative z-10">
          <div className="text-center mb-8">
            <h2 className="em-display text-[36px] font-extrabold text-[var(--em-ink)] tracking-tight mb-2">Crie sua conta</h2>
            <p className="text-[16px] font-medium text-[var(--em-text-soft)]">Preencha os dados abaixo para começar.</p>
          </div>

          <div className="em-card-hard p-6 sm:p-8 bg-white relative">
            
            {/* Segmented Control */}
            <div className="flex p-1.5 mb-8 rounded-[16px] bg-[var(--em-bg)] border-[1.5px] border-[var(--em-border-strong)]">
              <button
                type="button"
                onClick={() => setRole("aluno")}
                className={`flex-1 py-2.5 px-4 rounded-[10px] text-[14px] font-extrabold transition-all ${
                  role === "aluno" 
                    ? "bg-[var(--em-yellow)] text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" 
                    : "text-[var(--em-text-soft)] hover:text-[var(--em-ink)] border-[1.5px] border-transparent"
                }`}
              >
                Sou Aluno
              </button>
              <button
                type="button"
                onClick={() => setRole("professor")}
                className={`flex-1 py-2.5 px-4 rounded-[10px] text-[14px] font-extrabold transition-all ${
                  role === "professor" 
                    ? "bg-[var(--em-yellow)] text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" 
                    : "text-[var(--em-text-soft)] hover:text-[var(--em-ink)] border-[1.5px] border-transparent"
                }`}
              >
                Sou Professor
              </button>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[14px] font-bold text-[var(--em-ink)]">Nome completo</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Júlia Silva" 
                  className="h-[48px] rounded-[14px] border-[1.5px] border-[var(--em-border-strong)] focus-visible:ring-0 focus-visible:border-[var(--em-ink)] text-[15px] font-medium placeholder:text-[var(--em-text-mute)] bg-[var(--em-bg)] focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[14px] font-bold text-[var(--em-ink)]">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="julia@exemplo.com" 
                  className="h-[48px] rounded-[14px] border-[1.5px] border-[var(--em-border-strong)] focus-visible:ring-0 focus-visible:border-[var(--em-ink)] text-[15px] font-medium placeholder:text-[var(--em-text-mute)] bg-[var(--em-bg)] focus:bg-white transition-colors"
                />
              </div>

              {role === "aluno" && (
                <div className="space-y-2">
                  <Label htmlFor="objetivo" className="text-[14px] font-bold text-[var(--em-ink)]">Objetivo principal</Label>
                  <Select>
                    <SelectTrigger className="h-[48px] rounded-[14px] border-[1.5px] border-[var(--em-border-strong)] focus:ring-0 focus:border-[var(--em-ink)] text-[15px] font-medium bg-[var(--em-bg)] hover:bg-white transition-colors data-[state=open]:bg-white data-[state=open]:border-[var(--em-ink)]">
                      <SelectValue placeholder="Selecione o seu foco..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[1.5px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                      <SelectItem value="enem26" className="font-bold cursor-pointer focus:bg-[var(--em-mint)] focus:text-[var(--em-ink)]">ENEM 2026</SelectItem>
                      <SelectItem value="fuvest" className="font-bold cursor-pointer focus:bg-[var(--em-mint)] focus:text-[var(--em-ink)]">Fuvest</SelectItem>
                      <SelectItem value="unicamp" className="font-bold cursor-pointer focus:bg-[var(--em-mint)] focus:text-[var(--em-ink)]">Unicamp</SelectItem>
                      <SelectItem value="mackenzie" className="font-bold cursor-pointer focus:bg-[var(--em-mint)] focus:text-[var(--em-ink)]">Mackenzie</SelectItem>
                      <SelectItem value="treino" className="font-bold cursor-pointer focus:bg-[var(--em-mint)] focus:text-[var(--em-ink)]">Treino livre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[14px] font-bold text-[var(--em-ink)]">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mínimo 8 caracteres" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[48px] rounded-[14px] border-[1.5px] border-[var(--em-border-strong)] focus-visible:ring-0 focus-visible:border-[var(--em-ink)] text-[15px] font-medium placeholder:text-[var(--em-text-mute)] bg-[var(--em-bg)] focus:bg-white transition-colors pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--em-text-mute)] hover:text-[var(--em-ink)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex gap-1 h-2 rounded-full overflow-hidden bg-[var(--em-border)]">
                      <div className={`h-full transition-all duration-300 ${strength > 0 ? getStrengthColor(strength) : "bg-transparent"}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-[12px] font-extrabold text-[var(--em-text-soft)] min-w-[40px] text-right">
                      {getStrengthText(strength)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-[14px] font-bold text-[var(--em-ink)]">Confirmar senha</Label>
                <Input 
                  id="passwordConfirm" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite a senha novamente" 
                  className="h-[48px] rounded-[14px] border-[1.5px] border-[var(--em-border-strong)] focus-visible:ring-0 focus-visible:border-[var(--em-ink)] text-[15px] font-medium placeholder:text-[var(--em-text-mute)] bg-[var(--em-bg)] focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox id="terms" className="mt-0.5 border-[1.5px] border-[var(--em-ink)] data-[state=checked]:bg-[var(--em-ink)] data-[state=checked]:text-white rounded-[6px] w-5 h-5 shadow-[2px_2px_0_0_#0E0F12]" />
                <Label
                  htmlFor="terms"
                  className="text-[14px] font-medium text-[var(--em-text-soft)] leading-relaxed cursor-pointer"
                >
                  Li e aceito os <a href="#" className="font-bold text-[var(--em-ink)] underline decoration-2 decoration-[var(--em-yellow)] underline-offset-2">Termos de Uso</a> e a <a href="#" className="font-bold text-[var(--em-ink)] underline decoration-2 decoration-[var(--em-yellow)] underline-offset-2">Política de Privacidade</a>.
                </Label>
              </div>

              <div className="pt-6">
                <button type="submit" className="em-btn-primary w-full justify-center py-[18px] text-[16px]">
                  Criar minha conta gratuita
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-5 text-[13px] font-extrabold text-[var(--em-green-deep)] bg-[var(--em-green-soft)]/50 py-2 rounded-[10px] w-fit mx-auto px-4">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  Sem cartão. Cancele quando quiser.
                </div>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-[16px] font-medium text-[var(--em-text-soft)]">
              Já tem uma conta? <a href="#" className="font-bold text-[var(--em-ink)] hover:text-[var(--em-green-deep)] transition-colors underline decoration-[var(--em-border-strong)] underline-offset-4 hover:decoration-[var(--em-green-deep)]">Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
