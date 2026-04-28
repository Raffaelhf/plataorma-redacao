"use client";

import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  Instagram, 
  Mail, 
  Globe,
  Bell,
  Save,
  EyeOff,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

type PricingSettings = {
  mensalPlanPriceInCents: number;
  trimestralPlanPriceInCents: number;
  semestralPlanPriceInCents: number;
  anualPlanPriceInCents: number;
  mentoriaPlanPriceInCents: number;
  readingClubPriceInCents: number;
};

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

function inputToCents(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

function formatMoney(value: string) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(inputToCents(value) / 100);
}

export function AdminConfiguracoes({ initialPricing }: { initialPricing: PricingSettings }) {
  const [showPix, setShowPix] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pricing, setPricing] = useState({
    mensalPlanPrice: centsToInput(initialPricing.mensalPlanPriceInCents),
    trimestralPlanPrice: centsToInput(initialPricing.trimestralPlanPriceInCents),
    semestralPlanPrice: centsToInput(initialPricing.semestralPlanPriceInCents),
    anualPlanPrice: centsToInput(initialPricing.anualPlanPriceInCents),
    mentoriaPlanPrice: centsToInput(initialPricing.mentoriaPlanPriceInCents),
    readingClubPrice: centsToInput(initialPricing.readingClubPriceInCents),
  });

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3200);
  };

  const updatePricing = (field: keyof typeof pricing, value: string) => {
    setPricing((current) => ({ ...current, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pricing),
    });

    const payload = await response.json().catch(() => ({}));
    setIsSaving(false);

    if (!response.ok) {
      showMessage(payload.error || "Não foi possível salvar os valores.");
      return;
    }

    setPricing({
      mensalPlanPrice: centsToInput(payload.mensalPlanPriceInCents),
      trimestralPlanPrice: centsToInput(payload.trimestralPlanPriceInCents),
      semestralPlanPrice: centsToInput(payload.semestralPlanPriceInCents),
      anualPlanPrice: centsToInput(payload.anualPlanPriceInCents),
      mentoriaPlanPrice: centsToInput(payload.mentoriaPlanPriceInCents),
      readingClubPrice: centsToInput(payload.readingClubPriceInCents),
    });
    showMessage("Valores dos planos e cursos salvos com sucesso.");
  };

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Configurações · Plataforma"
      pageTitle="Dados oficiais da Escreva Mais."
      primaryAction={{ label: isSaving ? "Salvando..." : "Salvar configurações", onClick: handleSaveSettings }}
    >
      <div className="pb-12">
        {message ? (
          <div className="em-card-hard mb-6 bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* Warning Banner */}
        <div className="em-card-hard p-4 mb-8 bg-[var(--em-yellow-soft)] flex items-start sm:items-center gap-3 border-[1.5px] border-[var(--em-ink)]">
          <div className="mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5 text-[var(--em-ink)]" />
          </div>
          <div className="flex-1 text-[14px] font-bold text-[var(--em-ink)]">
            Atenção: Alterações nestes dados afetam toda a plataforma imediatamente. Revise com cuidado antes de salvar.
          </div>
        </div>

        <div className="em-card-hard mb-8 bg-white p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-[var(--em-border-strong)] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-[20px] font-extrabold text-[var(--em-ink)]">Planos e cursos oferecidos</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--em-text-soft)]">
                Defina os valores que aparecem no cadastro, checkout e cálculo de assinatura.
              </p>
            </div>
            <button onClick={handleSaveSettings} disabled={isSaving} className="em-btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar valores"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PriceField label="Plano mensal" description="Assinatura recorrente mensal." value={pricing.mensalPlanPrice} onChange={(value) => updatePricing("mensalPlanPrice", value)} />
            <PriceField label="Plano trimestral" description="Pacote de 3 meses." value={pricing.trimestralPlanPrice} onChange={(value) => updatePricing("trimestralPlanPrice", value)} />
            <PriceField label="Plano semestral" description="Pacote de 6 meses." value={pricing.semestralPlanPrice} onChange={(value) => updatePricing("semestralPlanPrice", value)} />
            <PriceField label="Plano anual" description="Pacote de 12 meses." value={pricing.anualPlanPrice} onChange={(value) => updatePricing("anualPlanPrice", value)} />
            <PriceField label="Monitoria individualizada" description="Valor base do adicional de monitoria." value={pricing.mentoriaPlanPrice} onChange={(value) => updatePricing("mentoriaPlanPrice", value)} />
            <PriceField label="Clube do Livro" description="Valor do adicional de leitura." value={pricing.readingClubPrice} onChange={(value) => updatePricing("readingClubPrice", value)} />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Mensal + Clube", pricing.mensalPlanPrice, pricing.readingClubPrice],
              ["Trimestral + Monitoria", pricing.trimestralPlanPrice, pricing.mentoriaPlanPrice],
              ["Semestral completo", pricing.semestralPlanPrice, pricing.mentoriaPlanPrice, pricing.readingClubPrice],
              ["Anual completo", pricing.anualPlanPrice, pricing.mentoriaPlanPrice, pricing.readingClubPrice],
            ].map(([label, ...values]) => {
              const total = values.reduce((sum, value) => sum + inputToCents(String(value)), 0);
              return (
                <div key={String(label)} className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-4">
                  <div className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">{label}</div>
                  <div className="mt-1 text-lg font-extrabold text-[var(--em-ink)]">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total / 100)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Forms */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Dados da Empresa */}
            <div className="em-card-hard p-6 md:p-8 bg-white">
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--em-border-strong)] pb-4">
                <Building2 className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Dados da Empresa</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Razão Social / Titular</label>
                  <input type="text" defaultValue="Escreva Mais Educação LTDA" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">CNPJ / CPF</label>
                  <input type="text" defaultValue="42.123.456/0001-89" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Inscrição Estadual (Opcional)</label>
                  <input type="text" defaultValue="123.456.789.123" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2 mt-2">
                  <h4 className="text-[14px] font-bold text-[var(--em-ink)] mb-2">Endereço</h4>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">CEP</label>
                  <input type="text" defaultValue="01234-567" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Rua / Logradouro</label>
                  <input type="text" defaultValue="Avenida Paulista" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Número</label>
                  <input type="text" defaultValue="1000" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Complemento</label>
                  <input type="text" defaultValue="Conjunto 123" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Bairro</label>
                  <input type="text" defaultValue="Bela Vista" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Cidade</label>
                      <input type="text" defaultValue="São Paulo" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium" />
                    </div>
                    <div className="w-24 space-y-1.5">
                      <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">UF</label>
                      <input type="text" defaultValue="SP" className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium text-center uppercase" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Bancários */}
            <div className="em-card-hard p-6 md:p-8 bg-[var(--em-cream)]">
              <div className="flex items-center justify-between border-b border-[var(--em-ink)] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--em-ink)]" />
                  <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Dados Bancários e PIX</h3>
                </div>
                <span className="px-2 py-1 bg-[var(--em-green)] text-[var(--em-ink)] text-[10px] font-extrabold uppercase rounded border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">Verificados</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Titular da Conta</label>
                  <input type="text" defaultValue="Escreva Mais Educação LTDA" className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Banco</label>
                  <select className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium">
                    <option>Itaú Unibanco S.A. (341)</option>
                    <option>Banco do Brasil S.A. (001)</option>
                    <option>Banco Bradesco S.A. (237)</option>
                    <option>Nubank (260)</option>
                    <option>Banco Inter (077)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Tipo de Conta</label>
                  <select className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium">
                    <option>Conta Corrente PJ</option>
                    <option>Conta Poupança PJ</option>
                    <option>Conta Pagamento</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Agência</label>
                  <input type="text" defaultValue="1234" className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Conta com Dígito</label>
                  <input type="text" defaultValue="56789-0" className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium" />
                </div>

                <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-[var(--em-border-strong)] mt-2">
                  <h4 className="text-[14px] font-bold text-[var(--em-ink)] mb-3">Chave PIX Principal</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select className="w-full sm:w-1/3 px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium">
                      <option>CNPJ</option>
                      <option>E-mail</option>
                      <option>Telefone</option>
                      <option>Chave Aleatória</option>
                    </select>
                    <div className="flex-1 relative">
                      <input 
                        type={showPix ? "text" : "password"} 
                        defaultValue="42.123.456/0001-89" 
                        className="w-full px-4 py-3 bg-white border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] text-[14px] font-medium pr-12" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPix(!showPix)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--em-text-mute)] hover:text-[var(--em-ink)]"
                      >
                        {showPix ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => showMessage("Chave PIX validada com sucesso.")} className="px-4 py-2 bg-[var(--em-ink)] text-[var(--em-yellow)] text-[13px] font-bold rounded-xl border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] hover:bg-black transition-colors">
                      Validar Chave PIX
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens e Observações */}
            <div className="em-card-hard p-6 md:p-8 bg-white">
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--em-border-strong)] pb-4">
                <Bell className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Notificações e Notas</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[14px] font-bold text-[var(--em-ink)] mb-4">Mensagens Automáticas</h4>
                  <div className="space-y-3">
                    {[
                      { id: "novo", label: "Notificação de novo cadastro", desc: "Envia e-mail de boas-vindas com dados de acesso." },
                      { id: "pag", label: "Lembrete de pagamento", desc: "Avisa 3 dias antes do vencimento da assinatura." },
                      { id: "renov", label: "Lembrete de renovação", desc: "Informa sobre a renovação automática anual/semestral." },
                      { id: "anuncio", label: "Anúncios da plataforma", desc: "Permite enviar comunicados globais na área logada." },
                    ].map((toggle, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] bg-[var(--em-bg)] transition-colors">
                        <div className="pt-1">
                          <input type="checkbox" id={toggle.id} defaultChecked className="w-5 h-5 rounded-[6px] border-2 border-[var(--em-ink)] accent-[var(--em-ink)] cursor-pointer" />
                        </div>
                        <div>
                          <label htmlFor={toggle.id} className="text-[14px] font-bold text-[var(--em-ink)] cursor-pointer block">{toggle.label}</label>
                          <p className="text-[12px] font-medium text-[var(--em-text-soft)]">{toggle.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--em-border-strong)]">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-[var(--em-ink)] uppercase tracking-wide">Notas Administrativas</label>
                    <p className="text-[12px] text-[var(--em-text-soft)] font-medium mb-2">Visível apenas para outros administradores da plataforma.</p>
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-3 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl outline-none focus:border-[var(--em-ink)] focus:bg-white text-[14px] font-medium resize-y"
                      placeholder="Adicione observações internas aqui..."
                      defaultValue="Revisar integrações de PIX até dia 15/11. Chave principal não deve ser alterada sem comunicar o suporte."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Canais Oficiais & Actions */}
          <div className="space-y-8">
            
            {/* Canais Oficiais */}
            <div className="em-card-hard p-6 bg-[var(--em-mint)]">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-5">Canais Oficiais</h3>
              
              <div className="space-y-4">
                <div className="space-y-2 p-3 bg-white border border-[var(--em-ink)] rounded-xl shadow-[2px_2px_0_0_#0E0F12]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--em-ink)]">
                    <Phone className="w-4 h-4 text-[var(--em-green-deep)]" /> WhatsApp Suporte
                  </div>
                  <input type="text" defaultValue="+55 (11) 98765-4321" className="w-full px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-lg text-[13px] font-semibold outline-none" />
                  <button onClick={() => showMessage("Canal de WhatsApp testado com sucesso.")} className="text-[11px] font-bold text-[var(--em-green-deep)] hover:underline mt-1 block">Testar canal</button>
                </div>

                <div className="space-y-2 p-3 bg-white border border-[var(--em-ink)] rounded-xl shadow-[2px_2px_0_0_#0E0F12]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--em-ink)]">
                    <Mail className="w-4 h-4 text-[var(--em-text-soft)]" /> E-mail Oficial
                  </div>
                  <input type="email" defaultValue="contato@escrevamais.com" className="w-full px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-lg text-[13px] font-semibold outline-none" />
                  <button onClick={() => showMessage("Canal de e-mail testado com sucesso.")} className="text-[11px] font-bold text-[var(--em-text-soft)] hover:text-[var(--em-ink)] hover:underline mt-1 block">Testar canal</button>
                </div>

                <div className="space-y-2 p-3 bg-white border border-[var(--em-ink)] rounded-xl shadow-[2px_2px_0_0_#0E0F12]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--em-ink)]">
                    <Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram
                  </div>
                  <input type="text" defaultValue="@escrevamais.oficial" className="w-full px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-lg text-[13px] font-semibold outline-none" />
                  <button onClick={() => showMessage("Instagram validado.")} className="text-[11px] font-bold text-[#E1306C] hover:underline mt-1 block">Testar canal</button>
                </div>

                <div className="space-y-2 p-3 bg-white border border-[var(--em-ink)] rounded-xl shadow-[2px_2px_0_0_#0E0F12]">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--em-ink)]">
                    <Globe className="w-4 h-4 text-[var(--em-indigo)]" /> Site Institucional
                  </div>
                  <input type="url" defaultValue="https://escrevamais.com.br" className="w-full px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-lg text-[13px] font-semibold outline-none" />
                  <button onClick={() => showMessage("Site institucional validado.")} className="text-[11px] font-bold text-[var(--em-indigo)] hover:underline mt-1 block">Testar canal</button>
                </div>
              </div>
            </div>

            {/* Actions Stick/Card */}
            <div className="em-card-hard p-6 bg-white sticky top-24">
              <h3 className="text-[14px] font-bold text-[var(--em-ink)] mb-4 text-center">Finalizar alterações</h3>
              <div className="flex flex-col gap-3">
                <button onClick={handleSaveSettings} disabled={isSaving} className="em-btn-primary w-full justify-center py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-60">
                  <Save className="w-4 h-4" /> {isSaving ? "Salvando..." : "Salvar configurações"}
                </button>
                <button onClick={() => showMessage("Alterações descartadas nesta visualização.")} className="w-full py-4 text-[15px] font-bold text-[var(--em-text-soft)] bg-transparent border-[1.5px] border-[var(--em-border-strong)] rounded-xl hover:border-[var(--em-ink)] hover:text-[var(--em-ink)] transition-colors">
                  Cancelar
                </button>
              </div>
              <p className="text-[11px] font-medium text-[var(--em-text-mute)] text-center mt-4 px-2">
                Última alteração salva por Ana Carolina em 10/10/2023 às 14:32.
              </p>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}

function PriceField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-4 transition-colors focus-within:border-[var(--em-ink)]">
      <span className="text-[12px] font-extrabold uppercase tracking-wide text-[var(--em-ink)]">{label}</span>
      <span className="mt-1 block text-xs font-semibold text-[var(--em-text-soft)]">{description}</span>
      <div className="mt-3 flex items-center rounded-xl border border-[var(--em-border-strong)] bg-white px-3 focus-within:border-[var(--em-ink)]">
        <span className="text-sm font-extrabold text-[var(--em-text-soft)]">R$</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => onChange(centsToInput(inputToCents(value)))}
          inputMode="decimal"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-lg font-extrabold text-[var(--em-ink)] outline-none"
          placeholder="0,00"
        />
      </div>
      <span className="mt-2 block text-xs font-bold text-[var(--em-green-deep)]">Será salvo como {formatMoney(value)}</span>
    </label>
  );
}
