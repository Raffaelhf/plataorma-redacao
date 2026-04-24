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
        <label className="text-sm text-slate-200">Nome</label>
        <Input placeholder="Seu nome" {...register('name')} />
        {errors.name ? <p className="text-xs text-amber-300">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">E-mail</label>
        <Input placeholder="seu@email.com" type="email" {...register('email')} />
        {errors.email ? <p className="text-xs text-amber-300">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Senha</label>
        <Input type="password" placeholder="********" {...register('password')} />
        {errors.password ? <p className="text-xs text-amber-300">{errors.password.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Perfil</label>
        <div className="flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-slate-200">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-white">Aluno</p>
            <p className="mt-0.5 text-xs text-slate-300">Professores sao cadastrados pela administracao.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Plano</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {planOptions.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-sm transition-colors',
                selectedPlan === opt.value ? 'border-indigo-400 bg-indigo-500/15 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-200',
              )}
            >
              <input type="radio" value={opt.value} {...register('plan')} className="sr-only" />
              <span className="font-semibold">{opt.label}</span>
              <span className="mt-1 text-xs text-slate-300">{planPrices?.[opt.value] ?? opt.price}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Para alunos, o cadastro segue para um checkout seguro. Os dados do cartao nao ficam armazenados na plataforma.
        </p>
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-200">
          <input type="checkbox" {...register('readingClub')} className="mt-1 h-4 w-4 accent-indigo-500" />
          <span>
            <span className="block font-semibold text-white">Adicionar Clube de Leitura</span>
            <span className="mt-1 block text-xs leading-6 text-slate-300">
              Acrescente o complemento por + {readingClubPriceLabel} para receber indicacoes de livros comentadas em lives selecionadas.
            </span>
          </span>
        </label>
        {errors.readingClub ? <p className="text-xs text-amber-300">{errors.readingClub.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-200">
          <input type="checkbox" {...register('mentoring')} className="mt-1 h-4 w-4 accent-indigo-500" />
          <span>
            <span className="block font-semibold text-white">Adicionar Mentoria</span>
            <span className="mt-1 block text-xs leading-6 text-slate-300">
              Pacote com desconto conforme o plano escolhido. Avulsa: {mentoringPriceLabel}
              {selectedPlan && mentoringPackagePrices?.[selectedPlan]
                ? `; no seu plano: + ${mentoringPackagePrices[selectedPlan].price} (${mentoringPackagePrices[selectedPlan].discountLabel}).`
                : '.'}
            </span>
          </span>
        </label>
        {errors.mentoring ? <p className="text-xs text-amber-300">{errors.mentoring.message}</p> : null}
      </div>
      {(selectedPlan || readingClub || mentoring) && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Resumo da escolha</p>
          <p className="mt-2">
            Plano: <span className="font-semibold text-indigo-200">{selectedPlan ? planOptions.find((item) => item.value === selectedPlan)?.label : 'Nao selecionado'}</span>
          </p>
          <p className="mt-1">
            Clube de Leitura: <span className="font-semibold text-indigo-200">{readingClub ? `Adicionado (+ ${readingClubPriceLabel})` : 'Nao incluido'}</span>
          </p>
          <p className="mt-1">
            Mentoria:{' '}
            <span className="font-semibold text-indigo-200">
              {mentoring
                ? selectedPlan && mentoringPackagePrices?.[selectedPlan]
                  ? `Adicionada (+ ${mentoringPackagePrices[selectedPlan].price})`
                  : 'Adicionada'
                : 'Nao incluida'}
            </span>
          </p>
        </div>
      )}
      {error ? <p className="text-sm text-amber-200">{error}</p> : null}
      <p className="text-xs leading-6 text-slate-400">
        Ao seguir para o checkout, voce podera revisar os{' '}
        <Link href="/termos-de-servico" className="font-semibold text-slate-200 underline underline-offset-4">
          termos de servico
        </Link>
        , a{' '}
        <Link href="/privacidade" className="font-semibold text-slate-200 underline underline-offset-4">
          politica de privacidade e LGPD
        </Link>{' '}
        e a{' '}
        <Link href="/politica-de-cookies" className="font-semibold text-slate-200 underline underline-offset-4">
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
