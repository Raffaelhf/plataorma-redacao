'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Loader2, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gradeLevelOptions } from '@/lib/grade-levels';

const planOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
] as const;

const creatorFieldClassName =
  'admin-readable-field rounded-2xl';

const creatorSelectClassName =
  'theme-field admin-readable-field w-full rounded-2xl px-4 py-3 text-sm';

export function AdminUserCreator() {
  const router = useRouter();
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        gradeLevel: formData.get('gradeLevel'),
        cpf: formData.get('cpf'),
        enrollmentNumber: formData.get('enrollmentNumber'),
        plan: formData.get('plan') || null,
        readingClub: formData.get('readingClub') === 'on',
        expertise: formData.get('expertise'),
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Não foi possível criar o cadastro.');
      setLoading(false);
      return;
    }

    setMessage(
      role === 'STUDENT'
        ? 'Aluno criado com sucesso. O e-mail para definir a senha foi enviado.'
        : 'Professor criado com sucesso. O e-mail para definir a senha foi enviado.',
    );
    setLoading(false);
    router.refresh();
  };

  return (
    <section className="admin-card rounded-[30px] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#5a69a1]">Novo cadastro</p>
          <h2 className="mt-1 text-xl font-semibold text-[#22347e]">Criar perfil de aluno ou professor</h2>
          <p className="mt-2 max-w-[42rem] text-sm leading-7 text-[#5f6d98]">
            Use esta área para cadastrar usuários manualmente. Para alunos, o plano e o Clube de Leitura ficam registrados no perfil.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#fff1eb_100%)] text-[#4250d4]">
          <UserPlus className="h-5 w-5" />
        </div>
      </div>

      <form action={handleSubmit} className="mt-5 space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="admin-card-soft flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-4">
            <input
              type="radio"
              name="role"
              value="STUDENT"
              checked={role === 'STUDENT'}
              onChange={() => setRole('STUDENT')}
              className="h-4 w-4 accent-[#4250d4]"
            />
            <GraduationCap className="h-4 w-4 text-[#4250d4]" />
            <span className="text-sm font-semibold text-[#22347e]">Aluno</span>
          </label>
          <label className="admin-card-soft flex cursor-pointer items-center gap-3 rounded-[24px] px-4 py-4">
            <input
              type="radio"
              name="role"
              value="TEACHER"
              checked={role === 'TEACHER'}
              onChange={() => setRole('TEACHER')}
              className="h-4 w-4 accent-[#4250d4]"
            />
            <Users className="h-4 w-4 text-[#4250d4]" />
            <span className="text-sm font-semibold text-[#22347e]">Professor</span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#52618f]">Nome</label>
            <Input
              name="name"
              required
              placeholder="Nome completo"
              className={creatorFieldClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#52618f]">E-mail</label>
            <Input
              name="email"
              type="email"
              required
              placeholder="usuario@email.com"
              className={creatorFieldClassName}
            />
          </div>
          {role === 'STUDENT' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#52618f]">Série</label>
                <select name="gradeLevel" defaultValue="" className={creatorSelectClassName}>
                  <option value="">Selecione a série</option>
                  {gradeLevelOptions.map((gradeLevel) => (
                    <option key={gradeLevel} value={gradeLevel}>
                      {gradeLevel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#52618f]">CPF</label>
                <Input
                  name="cpf"
                  placeholder="Ex.: 123.456.789-00"
                  className={creatorFieldClassName}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#52618f]">Número de matrícula</label>
                <Input
                  name="enrollmentNumber"
                  placeholder="Deixe em branco para gerar automaticamente"
                  className={creatorFieldClassName}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#52618f]">Especialidade</label>
              <Input
                name="expertise"
                placeholder="Ex.: Redação ENEM"
                className={creatorFieldClassName}
              />
            </div>
          )}
        </div>

        {role === 'STUDENT' ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#52618f]">Plano</label>
              <select
                name="plan"
                defaultValue=""
                className={creatorSelectClassName}
              >
                <option value="">Não informado</option>
                {planOptions.map((plan) => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="admin-card-soft flex items-center gap-3 rounded-[24px] px-4 py-4 text-sm font-medium text-[#22347e] md:self-end">
              <input type="checkbox" name="readingClub" className="h-4 w-4 accent-[#4250d4]" />
              Clube de Leitura
            </label>
          </div>
        ) : null}

        {error ? <p className="rounded-2xl border border-[#ffd0cf] bg-[#fff1f1] px-4 py-3 text-sm text-[#b14545]">{error}</p> : null}
        {message ? <p className="rounded-2xl border border-[#cfeedd] bg-[#eefbf5] px-4 py-3 text-sm text-[#1b7f62]">{message}</p> : null}

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
          {role === 'STUDENT' ? 'Criar aluno' : 'Criar professor'}
        </Button>
      </form>
    </section>
  );
}
