'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Loader2, UserRound } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const planValues = ['mensal', 'trimestral', 'semestral', 'anual'] as const;
type PlanValue = (typeof planValues)[number];

const planOptions = [
  { value: 'mensal', label: 'Mensal', price: 'R$ 80/mes' },
  { value: 'trimestral', label: 'Trimestral', price: 'R$ 218/trimestre' },
  { value: 'semestral', label: 'Semestral', price: 'R$ 413/semestre' },
  { value: 'anual', label: 'Anual', price: 'R$ 768/ano' },
] as const;

const schema = z
  .object({
    name: z.string().min(2, 'Informe seu nome'),
    email: z.string().email('E-mail invalido'),
    password: z.string().min(6, 'Minimo de 6 caracteres'),
    plan: z.enum(planValues).optional(),
    readingClub: z.boolean(),
    mentoring: z.boolean(),
  })
  .refine((data) => !data.readingClub || Boolean(data.plan), {
    message: 'Selecione um plano para adicionar o Clube de Leitura.',
    path: ['readingClub'],
  })
  .refine((data) => !data.mentoring || Boolean(data.plan), {
    message: 'Selecione um plano para adicionar a Mentoria.',
    path: ['mentoring'],
  });

type FormData = z.infer<typeof schema>;

type RegisterFormProps = {
  planPrices?: Record<PlanValue, string>;
  readingClubPriceLabel?: string;
  mentoringPackagePrices?: Record<PlanValue, { price: string; discountLabel: string }>;
  mentoringPriceLabel?: string;
};

export function RegisterForm({
  planPrices,
  readingClubPriceLabel = 'R$ 30',
  mentoringPackagePrices,
  mentoringPriceLabel = 'R$ 120',
}: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: undefined, readingClub: false, mentoring: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, readingClub, mentoring] = useWatch({
    control,
    name: ['plan', 'readingClub', 'mentoring'],
  });

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const readingClubParam = searchParams.get('readingClub');
    const mentoringParam = searchParams.get('mentoring');
    const normalizedPlan = planValues.find((value) => value === planParam);

    if (normalizedPlan) {
      setValue('plan', normalizedPlan, { shouldDirty: false });
    }

    if (readingClubParam === '1') {
      setValue('readingClub', true, { shouldDirty: false });
    }

    if (mentoringParam === '1') {
      setValue('mentoring', true, { shouldDirty: false });
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Erro ao criar conta.');
      setLoading(false);
      return;
    }
    const body = await res.json().catch(() => ({}));
    router.push(body.redirectTo || '/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--em-ink)]">Nome</label>
        <Input placeholder="Seu nome" {...register('name')} />
        {errors.name ? <p className="text-xs font-semibold text-[var(--em-coral)]">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--em-ink)]">E-mail</label>
        <Input placeholder="seu@email.com" type="email" {...register('email')} />
        {errors.email ? <p className="text-xs font-semibold text-[var(--em-coral)]">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--em-ink)]">Senha</label>
        <Input type="password" placeholder="********" {...register('password')} />
        {errors.password ? <p className="text-xs font-semibold text-[var(--em-coral)]">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--em-ink)]">Perfil</label>
        <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] px-4 py-3 text-sm text-[var(--em-ink)] shadow-[3px_3px_0_0_#0E0F12]">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[var(--em-green-deep)]">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-[var(--em-ink)]">Aluno</p>
            <p className="mt-0.5 text-xs text-[var(--em-ink-soft)]">Professores sao cadastrados pela administracao.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-[var(--em-ink)]">Plano</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {planOptions.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-sm transition-colors',
                selectedPlan === opt.value
                  ? 'border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)] shadow-[3px_3px_0_0_#0E0F12]'
                  : 'border-[var(--em-border-strong)] bg-[var(--em-bg)] text-[var(--em-ink)]',
              )}
            >
              <input type="radio" value={opt.value} {...register('plan')} className="sr-only" />
              <span className="font-semibold">{opt.label}</span>
              <span className="mt-1 text-xs text-[var(--em-text-soft)]">{planPrices?.[opt.value] ?? opt.price}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-[var(--em-text-soft)]">
          Para alunos, o cadastro segue para um checkout seguro. Os dados do cartao nao ficam armazenados na plataforma.
        </p>
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-4 text-sm text-[var(--em-ink)]">
          <input type="checkbox" {...register('readingClub')} className="mt-1 h-4 w-4 accent-indigo-500" />
          <span>
            <span className="block font-semibold text-[var(--em-ink)]">Adicionar Clube de Leitura</span>
            <span className="mt-1 block text-xs leading-6 text-[var(--em-text-soft)]">
              Acrescente o complemento por + {readingClubPriceLabel} para receber indicacoes de livros comentadas em lives selecionadas.
            </span>
          </span>
        </label>
        {errors.readingClub ? <p className="text-xs font-semibold text-[var(--em-coral)]">{errors.readingClub.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-4 text-sm text-[var(--em-ink)]">
          <input type="checkbox" {...register('mentoring')} className="mt-1 h-4 w-4 accent-indigo-500" />
          <span>
            <span className="block font-semibold text-[var(--em-ink)]">Adicionar Mentoria</span>
            <span className="mt-1 block text-xs leading-6 text-[var(--em-text-soft)]">
              Pacote com desconto conforme o plano escolhido. Avulsa: {mentoringPriceLabel}
              {selectedPlan && mentoringPackagePrices?.[selectedPlan]
                ? `; no seu plano: + ${mentoringPackagePrices[selectedPlan].price} (${mentoringPackagePrices[selectedPlan].discountLabel}).`
                : '.'}
            </span>
          </span>
        </label>
        {errors.mentoring ? <p className="text-xs font-semibold text-[var(--em-coral)]">{errors.mentoring.message}</p> : null}
      </div>
      {(selectedPlan || readingClub || mentoring) && (
        <div className="rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow-soft)] px-4 py-4 text-sm text-[var(--em-ink)]">
          <p className="font-semibold text-[var(--em-ink)]">Resumo da escolha</p>
          <p className="mt-2">
            Plano: <span className="font-semibold text-[var(--em-ink)]">{selectedPlan ? planOptions.find((item) => item.value === selectedPlan)?.label : 'Nao selecionado'}</span>
          </p>
          <p className="mt-1">
            Clube de Leitura: <span className="font-semibold text-[var(--em-ink)]">{readingClub ? `Adicionado (+ ${readingClubPriceLabel})` : 'Nao incluido'}</span>
          </p>
          <p className="mt-1">
            Mentoria:{' '}
            <span className="font-semibold text-[var(--em-ink)]">
              {mentoring
                ? selectedPlan && mentoringPackagePrices?.[selectedPlan]
                  ? `Adicionada (+ ${mentoringPackagePrices[selectedPlan].price})`
                  : 'Adicionada'
                : 'Nao incluida'}
            </span>
          </p>
        </div>
      )}
      {error ? <p className="text-sm font-semibold text-[var(--em-coral)]">{error}</p> : null}
      <p className="text-xs leading-6 text-[var(--em-text-soft)]">
        Ao seguir para o checkout, voce podera revisar os{' '}
        <Link href="/termos-de-servico" className="font-semibold text-[var(--em-ink)] underline underline-offset-4">
          termos de servico
        </Link>
        , a{' '}
        <Link href="/privacidade" className="font-semibold text-[var(--em-ink)] underline underline-offset-4">
          politica de privacidade e LGPD
        </Link>{' '}
        e a{' '}
        <Link href="/politica-de-cookies" className="font-semibold text-[var(--em-ink)] underline underline-offset-4">
          politica de cookies
        </Link>
        .
      </p>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserRound className="mr-2 h-4 w-4" />}
        Criar conta
      </Button>
    </form>
  );
}
