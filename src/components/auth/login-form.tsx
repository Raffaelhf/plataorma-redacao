'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getDashboardPathByRole } from '@/lib/roles';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const schema = z.object({
  login: z.string().min(1, { message: 'Informe seu login ou e-mail' }),
  password: z.string().min(3, { message: 'Mínimo de 3 caracteres' }),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const checkoutApproved = searchParams.get('checkout') === 'approved';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      login: data.login,
      password: data.password,
    });

    if (res?.error) {
      setError('Credenciais inválidas. Confira os dados e tente novamente.');
      setLoading(false);
      return;
    }

    const sessionResponse = await fetch('/api/auth/session');
    const session = (await sessionResponse.json()) as { user?: { role?: string } };
    const target = callbackUrl?.startsWith('/') ? callbackUrl : getDashboardPathByRole(session.user?.role);

    router.push(target);
    router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        {checkoutApproved ? (
          <p className="rounded-2xl border border-emerald-300/30 bg-emerald-300/12 px-3 py-2 text-sm text-emerald-50">
            Pagamento confirmado. Entre com o e-mail e a senha do cadastro para acessar a área do aluno.
          </p>
        ) : null}
        <label className="text-sm text-white/78">Login ou e-mail</label>
        <Input
          placeholder="Seu login ou e-mail"
          type="text"
          className="border-white/12 bg-white/10 text-white placeholder:text-white/38 focus:border-[#ffd26f] focus:ring-[#ffd26f]/20"
          {...register('login')}
        />
        {errors.login && <p className="text-xs text-[#ffdca8]">{errors.login.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/78">Senha</label>
        <Input
          placeholder="********"
          type="password"
          className="border-white/12 bg-white/10 text-white placeholder:text-white/38 focus:border-[#ffd26f] focus:ring-[#ffd26f]/20"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-[#ffdca8]">{errors.password.message}</p>}
      </div>
      {error && (
        <p className="flex items-center gap-2 rounded-2xl border border-[#ffcf99]/24 bg-[#ffcf99]/10 px-3 py-2 text-sm text-[#ffe0bb]">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      <Button type="submit" className="mt-2 h-12 w-full rounded-full text-sm font-bold" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Entrar
      </Button>
      <p className="text-center text-xs text-white/58">
        Não tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-[#ffdca8] underline decoration-[#ffdca8]/60 underline-offset-3">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
