'use client';

import Link from 'next/link';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const planValues = ['mensal', 'trimestral', 'semestral', 'anual'] as const;

const planOptions = [
  { value: 'mensal', label: 'Mensal', price: 'R$ 80/mês' },
  { value: 'trimestral', label: 'Trimestral', price: 'R$ 218/trimestre' },
  { value: 'semestral', label: 'Semestral', price: 'R$ 413/semestre' },
  { value: 'anual', label: 'Anual', price: 'R$ 768/ano' },
] as const;

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  role: z.enum(['STUDENT', 'TEACHER']),
  plan: z.enum(planValues).optional(),
  readingClub: z.boolean(),
}).refine((data) => !data.readingClub || Boolean(data.plan), {
  message: 'Selecione um plano para adicionar o Clube de Leitura.',
  path: ['readingClub'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
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
    defaultValues: { role: 'STUDENT', plan: undefined, readingClub: false },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, readingClub] = useWatch({
    control,
    name: ['plan', 'readingClub'],
  });

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const readingClubParam = searchParams.get('readingClub');
    const normalizedPlan = planValues.find((value) => value === planParam);

    if (normalizedPlan) {
      setValue('plan', normalizedPlan, { shouldDirty: false });
    }

    if (readingClubParam === '1') {
      setValue('readingClub', true, { shouldDirty: false });
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
        {errors.name && <p className="text-xs text-amber-300">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">E-mail</label>
        <Input placeholder="seu@email.com" type="email" {...register('email')} />
        {errors.email && <p className="text-xs text-amber-300">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Senha</label>
        <Input type="password" placeholder="••••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-amber-300">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Perfil</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { value: 'STUDENT', label: 'Aluno' },
            { value: 'TEACHER', label: 'Professor' },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-sm text-slate-200"
            >
              <input type="radio" value={opt.value} {...register('role')} className="accent-indigo-500" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.role && <p className="text-xs text-amber-300">{errors.role.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Plano</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {planOptions.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-sm transition-colors',
                selectedPlan === opt.value
                  ? 'border-indigo-400 bg-indigo-500/15 text-white'
                  : 'border-slate-800 bg-slate-900/60 text-slate-200',
              )}
            >
              <input type="radio" value={opt.value} {...register('plan')} className="sr-only" />
              <span className="font-semibold">{opt.label}</span>
              <span className="mt-1 text-xs text-slate-300">{opt.price}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Para alunos, o cadastro segue para um checkout seguro. Os dados do cartão não ficam armazenados na plataforma.
        </p>
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-sm text-slate-200">
          <input type="checkbox" {...register('readingClub')} className="mt-1 h-4 w-4 accent-indigo-500" />
          <span>
            <span className="block font-semibold text-white">Adicionar Clube de Leitura</span>
            <span className="mt-1 block text-xs leading-6 text-slate-300">
              Acrescente o complemento por + R$ 30 para receber indicações de livros comentadas em lives selecionadas.
            </span>
          </span>
        </label>
        {errors.readingClub && <p className="text-xs text-amber-300">{errors.readingClub.message}</p>}
      </div>
      {(selectedPlan || readingClub) && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Resumo da escolha</p>
          <p className="mt-2">
            Plano: <span className="font-semibold text-indigo-200">{selectedPlan ? planOptions.find((item) => item.value === selectedPlan)?.label : 'Não selecionado'}</span>
          </p>
          <p className="mt-1">
            Clube de Leitura:{' '}
            <span className="font-semibold text-indigo-200">{readingClub ? 'Adicionado (+ R$ 30)' : 'Não incluído'}</span>
          </p>
        </div>
      )}
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <p className="text-xs leading-6 text-slate-400">
        Ao seguir para o checkout, você poderá revisar os{' '}
        <Link href="/termos-de-servico" className="font-semibold text-slate-200 underline underline-offset-4">
          termos de serviço
        </Link>
        , a{' '}
        <Link href="/privacidade" className="font-semibold text-slate-200 underline underline-offset-4">
          política de privacidade e LGPD
        </Link>{' '}
        e a{' '}
        <Link href="/politica-de-cookies" className="font-semibold text-slate-200 underline underline-offset-4">
          política de cookies
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
