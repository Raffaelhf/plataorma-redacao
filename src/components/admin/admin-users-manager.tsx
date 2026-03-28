'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { KeyRound, Loader2, Power, RotateCcw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  studentProfile: {
    gradeLevel: string | null;
    cpf: string | null;
    enrollmentNumber: string | null;
    plan: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | null;
    readingClub: boolean;
  } | null;
};

type PasswordResetResult = {
  message: string;
  resetLink?: string;
  delivery?: 'manual' | 'email';
};

const planLabels = {
  MENSAL: 'Mensal',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
} as const;

const roleLabels = {
  STUDENT: 'Aluno',
  TEACHER: 'Professor',
  ADMIN: 'Administrador',
} as const;

const adminUserFieldClassName =
  'w-full rounded-2xl border border-[#d9def8] bg-white/96 px-4 py-3 text-sm text-[#22347e] placeholder:text-[#7b86b4] focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20 dark:!border-slate-600/80 dark:!bg-[#0b1324] dark:!text-[#eef4ff] dark:!placeholder:text-[#9db2d8] dark:focus:!border-[#7d8eff] dark:focus:!ring-[#6278ff]/25';

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function onlyDigits(value: string | null | undefined) {
  return (value ?? '').replace(/\D/g, '');
}

function formatCpf(value: string | null | undefined) {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return value || 'Não informado';
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function AdminUsersManager({ initialUsers }: { initialUsers: ManagedUser[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(() => initialUsers);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [profileLoadingId, setProfileLoadingId] = useState<string | null>(null);
  const [passwordLoadingId, setPasswordLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordResetResult, setPasswordResetResult] = useState<PasswordResetResult | null>(null);
  const [profileDrafts, setProfileDrafts] = useState<Record<string, { gradeLevel: string; cpf: string; enrollmentNumber: string }>>(() =>
    Object.fromEntries(
      initialUsers.map((user) => [
        user.id,
        {
          gradeLevel: user.studentProfile?.gradeLevel ?? '',
          cpf: user.studentProfile?.cpf ?? '',
          enrollmentNumber: user.studentProfile?.enrollmentNumber ?? '',
        },
      ]),
    ),
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalizeText(search);
    const queryDigits = onlyDigits(search);

    if (!normalizedQuery && !queryDigits) {
      return users;
    }

    return users.filter((user) => {
      const matchesText = [
        user.name,
        user.email,
        user.studentProfile?.enrollmentNumber,
      ].some((value) => normalizeText(value).includes(normalizedQuery));

      const matchesCpf = queryDigits ? onlyDigits(user.studentProfile?.cpf).includes(queryDigits) : false;
      const matchesEnrollmentDigits = queryDigits
        ? onlyDigits(user.studentProfile?.enrollmentNumber).includes(queryDigits)
        : false;

      return matchesText || matchesCpf || matchesEnrollmentDigits;
    });
  }, [search, users]);

  const handleToggle = async (user: ManagedUser, nextIsActive: boolean) => {
    setLoadingId(user.id);
    setError(null);

    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: nextIsActive }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Não foi possível atualizar o cadastro.');
      setLoadingId(null);
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              isActive: payload.isActive,
            }
          : item,
      ),
    );
    setLoadingId(null);
    router.refresh();
  };

  const handleDraftChange = (userId: string, field: 'gradeLevel' | 'cpf' | 'enrollmentNumber', value: string) => {
    setProfileDrafts((current) => ({
      ...current,
      [userId]: {
        gradeLevel: current[userId]?.gradeLevel ?? '',
        cpf: current[userId]?.cpf ?? '',
        enrollmentNumber: current[userId]?.enrollmentNumber ?? '',
        [field]: value,
      },
    }));
  };

  const handleProfileSave = async (user: ManagedUser) => {
    setProfileLoadingId(user.id);
    setError(null);
    setProfileSuccess(null);

    const draft = profileDrafts[user.id] ?? {
      gradeLevel: user.studentProfile?.gradeLevel ?? '',
      cpf: user.studentProfile?.cpf ?? '',
      enrollmentNumber: user.studentProfile?.enrollmentNumber ?? '',
    };

    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gradeLevel: draft.gradeLevel,
        cpf: draft.cpf,
        enrollmentNumber: draft.enrollmentNumber,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Não foi possível salvar os dados do aluno.');
      setProfileLoadingId(null);
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              studentProfile: payload.studentProfile ?? item.studentProfile,
            }
          : item,
      ),
    );

    setProfileDrafts((current) => ({
      ...current,
      [user.id]: {
        gradeLevel: payload.studentProfile?.gradeLevel ?? '',
        cpf: payload.studentProfile?.cpf ?? '',
        enrollmentNumber: payload.studentProfile?.enrollmentNumber ?? '',
      },
    }));

    setProfileSuccess(`Dados de ${user.name || user.email} atualizados com sucesso.`);
    setProfileLoadingId(null);
    router.refresh();
  };

  const handlePasswordReset = async (user: ManagedUser) => {
    const confirmed = window.confirm(
      `Redefinir a senha de ${user.name || user.email}? O acesso atual será invalidado e um link será enviado para o e-mail cadastrado.`,
    );

    if (!confirmed) {
      return;
    }

    setPasswordLoadingId(user.id);
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordResetResult(null);

    const response = await fetch(`/api/admin/users/${user.id}/password`, {
      method: 'PUT',
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setPasswordError(payload.error || 'Não foi possível enviar o e-mail de redefinição.');
      setPasswordLoadingId(null);
      return;
    }

    if (payload.resetLink) {
      let copiedToClipboard = false;
      try {
        await navigator.clipboard.writeText(payload.resetLink);
        copiedToClipboard = true;
      } catch {
        copiedToClipboard = false;
      }

      if (payload.delivery === 'manual') {
        setPasswordSuccess(
          copiedToClipboard
            ? `SMTP não configurado. O link de redefinição de ${user.name || user.email} foi copiado para a área de transferência.`
            : `SMTP não configurado. Use o link abaixo para ${user.name || user.email}.`,
        );
      } else {
        setPasswordSuccess(
          copiedToClipboard
            ? `E-mail de redefinição enviado para ${user.name || user.email}. O link também foi copiado para a área de transferência.`
            : `E-mail de redefinição enviado para ${user.name || user.email}. Se necessário, use o link abaixo.`,
        );
      }

      setPasswordResetResult({
        message: payload.message || 'Use o link abaixo para redefinir a senha.',
        resetLink: payload.resetLink,
        delivery: payload.delivery,
      });
    } else {
      setPasswordSuccess(`Link de redefinição enviado para ${user.name || user.email}.`);
    }

    setPasswordLoadingId(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-2xl border border-[#ffd0cf] bg-[#fff1f1] px-4 py-3 text-sm text-[#b14545]">{error}</p> : null}
      {profileSuccess ? (
        <p className="rounded-2xl border border-[#caeddc] bg-[#edf8f2] px-4 py-3 text-sm text-[#1b7f62]">{profileSuccess}</p>
      ) : null}
      {passwordError ? <p className="rounded-2xl border border-[#ffd0cf] bg-[#fff1f1] px-4 py-3 text-sm text-[#b14545]">{passwordError}</p> : null}
      {passwordSuccess ? (
        <p className="rounded-2xl border border-[#caeddc] bg-[#edf8f2] px-4 py-3 text-sm text-[#1b7f62]">{passwordSuccess}</p>
      ) : null}
      {passwordResetResult?.resetLink ? (
        <div className="rounded-2xl border border-[#d9def8] bg-white/90 px-4 py-4 text-sm text-[#3141bf]">
          <p className="font-semibold text-[#22347e]">{passwordResetResult.message}</p>
          <a
            href={passwordResetResult.resetLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block break-all font-medium text-[#4250d4] underline underline-offset-4"
          >
            {passwordResetResult.resetLink}
          </a>
        </div>
      ) : null}

      <div className="admin-card-soft rounded-[28px] p-4 sm:p-5">
        <label className="block text-sm font-semibold text-[#22347e]" htmlFor="admin-user-search">
          Buscar usuário
        </label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b86b4]" />
          <input
            id="admin-user-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquise por nome, CPF ou número de matrícula"
            className={`py-3 pl-11 pr-4 ${adminUserFieldClassName}`}
          />
        </div>
        <p className="mt-2 text-xs text-[#6d79a5]">
          {filteredUsers.length === users.length && !search
            ? `${users.length} usuário(s) carregado(s).`
            : `${filteredUsers.length} resultado(s) para a busca atual.`}
        </p>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const loading = loadingId === user.id;
          const profileLoading = profileLoadingId === user.id;
          const passwordLoading = passwordLoadingId === user.id;
          const draft = profileDrafts[user.id] ?? {
            gradeLevel: user.studentProfile?.gradeLevel ?? '',
            cpf: user.studentProfile?.cpf ?? '',
            enrollmentNumber: user.studentProfile?.enrollmentNumber ?? '',
          };
          return (
            <section
              key={user.id}
              className="admin-card-soft rounded-[28px] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-[#22347e]">{user.name || user.email}</p>
                    <span className="rounded-full bg-[linear-gradient(135deg,#eef2ff_0%,#fff0e8_100%)] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                      {roleLabels[user.role as keyof typeof roleLabels] ?? user.role}
                    </span>
                    <Badge label={user.isActive ? 'Ativo' : 'Cadastro cancelado'} variant={user.isActive ? 'success' : 'warning'} />
                  </div>
                  <p className="mt-2 text-sm text-[#52618f]">{user.email}</p>
                  <p className="mt-1 text-xs text-[#6d79a5]">
                    Criado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(user.createdAt))}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#6d79a5]">
                    Ao redefinir a senha, o acesso atual é invalidado e um link temporário é enviado para o e-mail cadastrado.
                  </p>
                  {user.role === 'STUDENT' ? (
                    <>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                          Plano: {user.studentProfile?.plan ? planLabels[user.studentProfile.plan] : 'Não informado'}
                        </span>
                        <span className="rounded-full bg-[#edf8f2] px-3 py-1 text-xs font-semibold text-[#1b7f62]">
                          Clube de Leitura: {user.studentProfile?.readingClub ? 'Sim' : 'Não'}
                        </span>
                        <span className="rounded-full bg-[#fff3ea] px-3 py-1 text-xs font-semibold text-[#c96a2f]">
                          Série: {user.studentProfile?.gradeLevel || 'Não informada'}
                        </span>
                        <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#7a58b5]">
                          CPF: {formatCpf(user.studentProfile?.cpf)}
                        </span>
                        <span className="rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#2f6fa8]">
                          Matrícula: {user.studentProfile?.enrollmentNumber || 'Não informada'}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <input
                          value={draft.gradeLevel}
                          onChange={(event) => handleDraftChange(user.id, 'gradeLevel', event.target.value)}
                          placeholder="Série"
                          className={adminUserFieldClassName}
                        />
                        <input
                          value={draft.cpf}
                          onChange={(event) => handleDraftChange(user.id, 'cpf', event.target.value)}
                          placeholder="CPF"
                          className={adminUserFieldClassName}
                        />
                        <input
                          value={draft.enrollmentNumber}
                          onChange={(event) => handleDraftChange(user.id, 'enrollmentNumber', event.target.value)}
                          placeholder="Número de matrícula"
                          className={adminUserFieldClassName}
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {user.role === 'STUDENT' ? (
                    <Button
                      type="button"
                      disabled={profileLoading}
                      variant="secondary"
                      className="border border-[#d9def8] bg-white/90 text-[#3141bf] hover:bg-[#eef2ff] hover:text-[#22347e]"
                      onClick={() => handleProfileSave(user)}
                    >
                      {profileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {profileLoading ? 'Salvando dados...' : 'Salvar CPF e matrícula'}
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    disabled={passwordLoading}
                    variant="secondary"
                    className="border border-[#d9def8] bg-white/90 text-[#3141bf] hover:bg-[#eef2ff] hover:text-[#22347e]"
                    onClick={() => handlePasswordReset(user)}
                  >
                    {passwordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    {passwordLoading ? 'Enviando link...' : 'Redefinir senha'}
                  </Button>

                  {user.role !== 'ADMIN' ? (
                    <Button
                      type="button"
                      disabled={loading}
                      variant={user.isActive ? 'ghost' : 'secondary'}
                      className={
                        user.isActive
                          ? 'border border-[#ffd0cf] bg-[#fff1f1] text-[#b14545] hover:bg-[#ffe7e7]'
                          : 'border border-[#d9def8] bg-white/90 text-[#3141bf] hover:bg-[#eef2ff] hover:text-[#22347e]'
                      }
                      onClick={() => handleToggle(user, !user.isActive)}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : user.isActive ? (
                        <Power className="mr-2 h-4 w-4" />
                      ) : (
                        <RotateCcw className="mr-2 h-4 w-4" />
                      )}
                      {user.isActive ? 'Cancelar cadastro' : 'Reativar cadastro'}
                    </Button>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
        {filteredUsers.length === 0 ? (
          <section className="admin-card-soft rounded-[28px] p-6 text-sm text-[#6d79a5]">
            Nenhum usuário encontrado para essa busca.
          </section>
        ) : null}
      </div>
    </div>
  );
}
