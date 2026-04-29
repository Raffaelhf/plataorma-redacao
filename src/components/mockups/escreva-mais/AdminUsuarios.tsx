"use client";

import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import {
  GraduationCap,
  KeyRound,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  UserRoundX,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { gradeLevelOptions } from "@/lib/grade-levels";

type ManagedUser = {
  id: string;
  name: string | null;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
  isActive: boolean;
  createdAt: string;
  studentProfile: {
    gradeLevel: string | null;
    cpf: string | null;
    enrollmentNumber: string | null;
    plan: "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL" | null;
    readingClub: boolean;
    mentoring: boolean;
    bio: string | null;
  } | null;
  teacherProfile: {
    expertise: string | null;
    bio: string | null;
  } | null;
};

type Draft = {
  name: string;
  email: string;
  isActive: boolean;
  gradeLevel: string;
  cpf: string;
  enrollmentNumber: string;
  plan: string;
  readingClub: boolean;
  mentoring: boolean;
  studentBio: string;
  expertise: string;
  teacherBio: string;
};

const roleLabels: Record<string, string> = {
  STUDENT: "Aluno",
  TEACHER: "Professor",
  ADMIN: "Admin",
};

const planLabels: Record<string, string> = {
  MENSAL: "Mensal",
  TRIMESTRAL: "Trimestral",
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
};

const inputClass =
  "w-full rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-2.5 text-[14px] font-medium text-[var(--em-ink)] outline-none transition-colors focus:border-[var(--em-ink)]";

const pageSize = 8;

function initials(nameOrEmail: string) {
  return nameOrEmail
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getUserPlanOrArea(user: ManagedUser) {
  if (user.role === "STUDENT") return user.studentProfile?.plan ? planLabels[user.studentProfile.plan] : "-";
  if (user.role === "ADMIN") return "Escreva Mais";

  const expertise = user.teacherProfile?.expertise?.trim();
  return !expertise || normalize(expertise) === "redacao enem" ? "Escreva Mais" : expertise;
}

function createDraft(user: ManagedUser): Draft {
  return {
    name: user.name ?? "",
    email: user.email,
    isActive: user.isActive,
    gradeLevel: user.studentProfile?.gradeLevel ?? "",
    cpf: user.studentProfile?.cpf ?? "",
    enrollmentNumber: user.studentProfile?.enrollmentNumber ?? "",
    plan: user.studentProfile?.plan ?? "",
    readingClub: Boolean(user.studentProfile?.readingClub),
    mentoring: Boolean(user.studentProfile?.mentoring),
    studentBio: user.studentProfile?.bio ?? "",
    expertise: user.teacherProfile?.expertise ?? "",
    teacherBio: user.teacherProfile?.bio ?? "",
  };
}

function createEmptyDraft(): Draft {
  return {
    name: "",
    email: "",
    isActive: true,
    gradeLevel: "",
    cpf: "",
    enrollmentNumber: "",
    plan: "",
    readingClub: false,
    mentoring: false,
    studentBio: "",
    expertise: "",
    teacherBio: "",
  };
}

export function AdminUsuarios({ initialUsers }: { initialUsers: ManagedUser[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [orderFilter, setOrderFilter] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createRole, setCreateRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [createDraftState, setCreateDraftState] = useState<Draft>(createEmptyDraft);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const query = normalize(search);
    const filtered = users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.studentProfile?.cpf, user.studentProfile?.enrollmentNumber, user.teacherProfile?.expertise]
          .some((value) => normalize(value).includes(query));
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive);
      const matchesPlan =
        planFilter === "ALL" ||
        (planFilter === "NONE" && user.role === "STUDENT" && !user.studentProfile?.plan) ||
        user.studentProfile?.plan === planFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesPlan;
    });

    return filtered.sort((a, b) => {
      if (orderFilter === "az") {
        return (a.name || a.email).localeCompare(b.name || b.email, "pt-BR");
      }
      if (orderFilter === "za") {
        return (b.name || b.email).localeCompare(a.name || a.email, "pt-BR");
      }
      if (orderFilter === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orderFilter, planFilter, roleFilter, search, statusFilter, users]);

  const stats = useMemo(() => {
    const students = users.filter((user) => user.role === "STUDENT");
    return {
      activeStudents: students.filter((user) => user.isActive).length,
      inactiveStudents: students.filter((user) => !user.isActive).length,
      teachers: users.filter((user) => user.role === "TEACHER").length,
      admins: users.filter((user) => user.role === "ADMIN").length,
    };
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const showingStart = filteredUsers.length ? (safePage - 1) * pageSize + 1 : 0;
  const showingEnd = Math.min(safePage * pageSize, filteredUsers.length);

  const openEditor = (user: ManagedUser) => {
    setEditingUser(user);
    setDraft(createDraft(user));
    setOpenMenuId(null);
    setError(null);
    setMessage(null);
  };

  const openCreator = () => {
    setCreateRole("STUDENT");
    setCreateDraftState(createEmptyDraft());
    setIsCreating(true);
    setOpenMenuId(null);
    setError(null);
    setMessage(null);
  };

  const updateDraft = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateCreateDraft = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setCreateDraftState((current) => ({ ...current, [key]: value }));
  };

  const applyStatFilter = (role: "STUDENT" | "TEACHER" | "ADMIN", status: "ALL" | "ACTIVE" | "INACTIVE" = "ALL") => {
    setRoleFilter(role);
    setStatusFilter(status);
    setPlanFilter("ALL");
    setSearch("");
  };

  const handleCreate = async () => {
    setLoadingAction("create");
    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: createRole,
        name: createDraftState.name,
        email: createDraftState.email,
        ...(createRole === "STUDENT"
          ? {
              gradeLevel: createDraftState.gradeLevel,
              cpf: createDraftState.cpf,
              enrollmentNumber: createDraftState.enrollmentNumber,
              plan: createDraftState.plan || null,
              readingClub: createDraftState.readingClub,
              mentoring: createDraftState.mentoring,
              studentBio: createDraftState.studentBio,
            }
          : {
              expertise: createDraftState.expertise,
              teacherBio: createDraftState.teacherBio,
            }),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Não foi possível criar o usuário.");
      setLoadingAction(null);
      return;
    }

    const createdUser = { ...payload, createdAt: new Date(payload.createdAt).toISOString() } as ManagedUser & {
      resetLink?: string;
      delivery?: string;
    };
    setUsers((current) => [createdUser, ...current]);
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPlanFilter("ALL");
    setOrderFilter("recent");
    setCurrentPage(1);
    setIsCreating(false);
    setCreateDraftState(createEmptyDraft());
    setLoadingAction(null);

    if (createdUser.resetLink) {
      try {
        await navigator.clipboard.writeText(createdUser.resetLink);
        setMessage("Usuário criado. Link de senha copiado para a área de transferência.");
      } catch {
        setMessage(`Usuário criado. Link de senha: ${createdUser.resetLink}`);
      }
    } else {
      setMessage("Usuário criado com sucesso.");
    }

    router.refresh();
  };

  const handleSave = async () => {
    if (!editingUser || !draft) return;

    setLoadingAction(`save-${editingUser.id}`);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        email: draft.email,
        isActive: draft.isActive,
        ...(editingUser.role === "STUDENT"
          ? {
              gradeLevel: draft.gradeLevel,
              cpf: draft.cpf,
              enrollmentNumber: draft.enrollmentNumber,
              plan: draft.plan || null,
              readingClub: draft.readingClub,
              mentoring: draft.mentoring,
              studentBio: draft.studentBio,
            }
          : {}),
        ...(editingUser.role === "TEACHER"
          ? {
              expertise: draft.expertise,
              teacherBio: draft.teacherBio,
            }
          : {}),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Não foi possível salvar o usuário.");
      setLoadingAction(null);
      return;
    }

    setUsers((current) => current.map((user) => (user.id === payload.id ? { ...payload, createdAt: new Date(payload.createdAt).toISOString() } : user)));
    setEditingUser(null);
    setDraft(null);
    setLoadingAction(null);
    setMessage("Usuário atualizado com sucesso.");
    router.refresh();
  };

  const handlePasswordReset = async (user: ManagedUser) => {
    const confirmed = window.confirm(`Redefinir a senha de ${user.name || user.email}?`);
    if (!confirmed) return;

    setLoadingAction(`password-${user.id}`);
    setError(null);
    setMessage(null);
    setOpenMenuId(null);

    const response = await fetch(`/api/admin/users/${user.id}/password`, { method: "PUT" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Não foi possível redefinir a senha.");
      setLoadingAction(null);
      return;
    }

    if (payload.resetLink) {
      try {
        await navigator.clipboard.writeText(payload.resetLink);
        setMessage("Link de redefinição copiado para a área de transferência.");
      } catch {
        setMessage(`Link de redefinição: ${payload.resetLink}`);
      }
    } else {
      setMessage("E-mail de redefinição enviado.");
    }
    setLoadingAction(null);
  };

  const handleDelete = async (user: ManagedUser) => {
    const confirmed = window.confirm(`Excluir permanentemente ${user.name || user.email}? Essa acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setLoadingAction(`delete-${user.id}`);
    setError(null);
    setMessage(null);
    setOpenMenuId(null);

    const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "Não foi possível excluir o usuário.");
      setLoadingAction(null);
      return;
    }

    setUsers((current) => current.filter((item) => item.id !== user.id));
    setLoadingAction(null);
    setMessage("Usuário excluído com sucesso.");
    router.refresh();
  };

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker={`Usuários - ${users.length} cadastros`}
      pageTitle="Gestão de usuários."
      primaryAction={{ label: "Adicionar usuário", onClick: openCreator }}
    >
      <div className="space-y-8 pb-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Alunos ativos" value={stats.activeStudents} icon={<GraduationCap className="h-4 w-4" />} bg="var(--em-mint)" onClick={() => applyStatFilter("STUDENT", "ACTIVE")} />
          <StatCard title="Alunos cancelados" value={stats.inactiveStudents} icon={<UserRoundX className="h-4 w-4" />} bg="var(--em-peach)" onClick={() => applyStatFilter("STUDENT", "INACTIVE")} />
          <StatCard title="Professores" value={stats.teachers} icon={<Users className="h-4 w-4" />} bg="var(--em-lavender)" onClick={() => applyStatFilter("TEACHER")} />
          <StatCard title="Admins" value={stats.admins} icon={<ShieldAlert className="h-4 w-4" />} bg="var(--em-cream)" onClick={() => applyStatFilter("ADMIN")} />
        </div>

        {message ? <div className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-mint)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">{message}</div> : null}
        {error ? <div className="rounded-2xl border border-[var(--em-ink)] bg-[var(--em-rose)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">{error}</div> : null}

        <div className="em-card-hard space-y-4 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--em-text-mute)]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, email, CPF, matricula ou especialidade..."
                className="w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] py-3 pl-11 pr-4 text-[14px] font-semibold text-[var(--em-ink)] outline-none transition-colors focus:border-[var(--em-ink)] focus:bg-white"
              />
            </div>
            <button className="em-btn-primary shrink-0 py-3" onClick={openCreator}>
              <Plus className="h-4 w-4" /> Novo usuário
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <select className="em-chip shrink-0 bg-white outline-none hover:bg-[var(--em-bg-alt)]" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="ALL">Tipo: Todos</option>
              <option value="STUDENT">Aluno</option>
              <option value="TEACHER">Professor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select className="em-chip shrink-0 bg-white outline-none hover:bg-[var(--em-bg-alt)]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">Status: Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Cancelado</option>
            </select>
            <select className="em-chip shrink-0 bg-white outline-none hover:bg-[var(--em-bg-alt)]" value={planFilter} onChange={(event) => setPlanFilter(event.target.value)}>
              <option value="ALL">Plano: Todos</option>
              <option value="MENSAL">Mensal</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="SEMESTRAL">Semestral</option>
              <option value="ANUAL">Anual</option>
              <option value="NONE">Sem plano</option>
            </select>
            <select className="em-chip shrink-0 bg-white outline-none hover:bg-[var(--em-bg-alt)]" value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}>
              <option value="recent">Ordem: Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
        </div>

        <div className="em-card-hard overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Usuário</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Papel</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Status</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Plano / área</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Criado em</th>
                  <th className="p-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {pageUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--em-border)] transition-colors hover:bg-[var(--em-cream)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--em-ink)] bg-[var(--em-peach)] text-[11px] font-bold text-[var(--em-ink)]">
                          {initials(user.name || user.email)}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold leading-tight text-[var(--em-ink)]">{user.name || "Sem nome"}</div>
                          <div className="text-[12px] font-semibold text-[var(--em-text-soft)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${user.isActive ? "bg-[var(--em-green-soft)] text-[var(--em-green-deep)]" : "border border-[var(--em-ink)] bg-[var(--em-rose)] text-[var(--em-ink)]"}`}>
                        {user.isActive ? "Ativo" : "Cancelado"}
                      </span>
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[var(--em-ink)]">
                      {getUserPlanOrArea(user)}
                    </td>
                    <td className="p-4 text-[13px] font-semibold text-[var(--em-text-soft)]">
                      {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(user.createdAt))}
                    </td>
                    <td className="relative p-4 text-right">
                      <button
                        className="rounded p-1.5 text-[var(--em-text-mute)] transition-colors hover:bg-[var(--em-bg-alt)] hover:text-[var(--em-ink)]"
                        onClick={() => setOpenMenuId((current) => (current === user.id ? null : user.id))}
                        aria-label={`Ações de ${user.name || user.email}`}
                      >
                        {loadingAction?.endsWith(user.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                      </button>

                      {openMenuId === user.id ? (
                        <div className="absolute right-4 top-11 z-30 w-64 rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-white p-2 text-left shadow-[4px_4px_0_0_#0E0F12]">
                          <MenuButton icon={<Pencil className="h-4 w-4" />} label="Modificar dados" onClick={() => openEditor(user)} disabled={user.role === "ADMIN"} />
                          <MenuButton icon={<KeyRound className="h-4 w-4" />} label="Reset de senha" onClick={() => handlePasswordReset(user)} disabled={user.role === "ADMIN"} />
                          <MenuButton icon={<Trash2 className="h-4 w-4" />} label="Excluir usuário" danger onClick={() => handleDelete(user)} disabled={user.role === "ADMIN"} />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {!pageUsers.length ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm font-bold text-[var(--em-text-soft)]">
                      Nenhum usuário encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--em-ink)] bg-[var(--em-bg)] p-4 text-[13px] font-semibold text-[var(--em-text-soft)]">
            <span>
              Mostrando {showingStart}-{showingEnd} de {filteredUsers.length} filtrados
            </span>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage <= 1}
              >
                Anterior
              </button>
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)]">
                {safePage}/{totalPages}
              </span>
              <button
                className="rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage >= totalPages}
              >
                Proxima
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCreating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--em-ink)]/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border-2 border-[var(--em-ink)] bg-[var(--em-cream)] p-5 shadow-[8px_8px_0_0_#0E0F12]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--em-text-soft)]">Novo cadastro</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[var(--em-ink)]">Adicionar usuário</h3>
              </div>
              <button className="rounded-xl border border-[var(--em-ink)] bg-white p-2" onClick={() => setIsCreating(false)} aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--em-border-strong)] bg-white p-1">
              <button
                type="button"
                className={`rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${createRole === "STUDENT" ? "bg-[var(--em-ink)] text-white" : "text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]"}`}
                onClick={() => setCreateRole("STUDENT")}
              >
                Aluno
              </button>
              <button
                type="button"
                className={`rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${createRole === "TEACHER" ? "bg-[var(--em-ink)] text-white" : "text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]"}`}
                onClick={() => setCreateRole("TEACHER")}
              >
                Professor
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome completo">
                <input className={inputClass} value={createDraftState.name} onChange={(event) => updateCreateDraft("name", event.target.value)} />
              </Field>
              <Field label="E-mail">
                <input className={inputClass} type="email" value={createDraftState.email} onChange={(event) => updateCreateDraft("email", event.target.value)} />
              </Field>

              {createRole === "STUDENT" ? (
                <>
                  <Field label="Serie">
                    <select className={inputClass} value={createDraftState.gradeLevel} onChange={(event) => updateCreateDraft("gradeLevel", event.target.value)}>
                      <option value="">Nao informada</option>
                      {gradeLevelOptions.map((gradeLevel) => (
                        <option key={gradeLevel} value={gradeLevel}>{gradeLevel}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="CPF">
                    <input className={inputClass} value={createDraftState.cpf} onChange={(event) => updateCreateDraft("cpf", event.target.value)} />
                  </Field>
                  <Field label="Matricula">
                    <input className={inputClass} value={createDraftState.enrollmentNumber} onChange={(event) => updateCreateDraft("enrollmentNumber", event.target.value)} placeholder="Gerada automaticamente se ficar vazia" />
                  </Field>
                  <Field label="Plano">
                    <select className={inputClass} value={createDraftState.plan} onChange={(event) => updateCreateDraft("plan", event.target.value)}>
                      <option value="">Nao informado</option>
                      <option value="MENSAL">Mensal</option>
                      <option value="TRIMESTRAL">Trimestral</option>
                      <option value="SEMESTRAL">Semestral</option>
                      <option value="ANUAL">Anual</option>
                    </select>
                  </Field>
                  <label className="flex items-center gap-2 rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-3 text-sm font-bold text-[var(--em-ink)]">
                    <input type="checkbox" checked={createDraftState.readingClub} onChange={(event) => updateCreateDraft("readingClub", event.target.checked)} />
                    Clube do Livro
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-3 text-sm font-bold text-[var(--em-ink)]">
                    <input type="checkbox" checked={createDraftState.mentoring} onChange={(event) => updateCreateDraft("mentoring", event.target.checked)} />
                    Monitoria individualizada
                  </label>
                  <Field label="Observacoes do aluno" className="md:col-span-2">
                    <textarea className={`${inputClass} min-h-24`} value={createDraftState.studentBio} onChange={(event) => updateCreateDraft("studentBio", event.target.value)} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Especialidade">
                    <input className={inputClass} value={createDraftState.expertise} onChange={(event) => updateCreateDraft("expertise", event.target.value)} placeholder="Escreva Mais, gramática, repertório..." />
                  </Field>
                  <Field label="Bio do professor" className="md:col-span-2">
                    <textarea className={`${inputClass} min-h-24`} value={createDraftState.teacherBio} onChange={(event) => updateCreateDraft("teacherBio", event.target.value)} />
                  </Field>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button className="rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--em-ink)]" onClick={() => setIsCreating(false)}>
                Cancelar
              </button>
              <button className="em-btn-primary justify-center" onClick={handleCreate} disabled={loadingAction === "create"}>
                {loadingAction === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Criar usuário
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingUser && draft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--em-ink)]/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border-2 border-[var(--em-ink)] bg-[var(--em-cream)] p-5 shadow-[8px_8px_0_0_#0E0F12]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--em-text-soft)]">Editar cadastro</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[var(--em-ink)]">{editingUser.name || editingUser.email}</h3>
              </div>
              <button className="rounded-xl border border-[var(--em-ink)] bg-white p-2" onClick={() => setEditingUser(null)} aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome completo">
                <input className={inputClass} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
              </Field>
              <Field label="E-mail">
                <input className={inputClass} type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
              </Field>
              <Field label="Status">
                <select className={inputClass} value={draft.isActive ? "active" : "inactive"} onChange={(event) => updateDraft("isActive", event.target.value === "active")}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Cancelado</option>
                </select>
              </Field>

              {editingUser.role === "STUDENT" ? (
                <>
                  <Field label="Serie">
                    <select className={inputClass} value={draft.gradeLevel} onChange={(event) => updateDraft("gradeLevel", event.target.value)}>
                      <option value="">Nao informada</option>
                      {gradeLevelOptions.map((gradeLevel) => (
                        <option key={gradeLevel} value={gradeLevel}>{gradeLevel}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="CPF">
                    <input className={inputClass} value={draft.cpf} onChange={(event) => updateDraft("cpf", event.target.value)} />
                  </Field>
                  <Field label="Matricula">
                    <input className={inputClass} value={draft.enrollmentNumber} onChange={(event) => updateDraft("enrollmentNumber", event.target.value)} />
                  </Field>
                  <Field label="Plano">
                    <select className={inputClass} value={draft.plan} onChange={(event) => updateDraft("plan", event.target.value)}>
                      <option value="">Nao informado</option>
                      <option value="MENSAL">Mensal</option>
                      <option value="TRIMESTRAL">Trimestral</option>
                      <option value="SEMESTRAL">Semestral</option>
                      <option value="ANUAL">Anual</option>
                    </select>
                  </Field>
                  <label className="flex items-center gap-2 rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-3 text-sm font-bold text-[var(--em-ink)]">
                    <input type="checkbox" checked={draft.readingClub} onChange={(event) => updateDraft("readingClub", event.target.checked)} />
                    Clube do Livro
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-3 text-sm font-bold text-[var(--em-ink)]">
                    <input type="checkbox" checked={draft.mentoring} onChange={(event) => updateDraft("mentoring", event.target.checked)} />
                    Monitoria individualizada
                  </label>
                  <Field label="Observacoes do aluno" className="md:col-span-2">
                    <textarea className={`${inputClass} min-h-24`} value={draft.studentBio} onChange={(event) => updateDraft("studentBio", event.target.value)} />
                  </Field>
                </>
              ) : null}

              {editingUser.role === "TEACHER" ? (
                <>
                  <Field label="Especialidade">
                    <input className={inputClass} value={draft.expertise} onChange={(event) => updateDraft("expertise", event.target.value)} />
                  </Field>
                  <Field label="Bio do professor" className="md:col-span-2">
                    <textarea className={`${inputClass} min-h-24`} value={draft.teacherBio} onChange={(event) => updateDraft("teacherBio", event.target.value)} />
                  </Field>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button className="rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--em-ink)]" onClick={() => setEditingUser(null)}>
                Cancelar
              </button>
              <button className="em-btn-primary justify-center" onClick={handleSave} disabled={loadingAction === `save-${editingUser.id}`}>
                {loadingAction === `save-${editingUser.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar alteracoes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}

function StatCard({ title, value, icon, bg, onClick }: { title: string; value: number; icon: React.ReactNode; bg: string; onClick?: () => void }) {
  return (
    <button type="button" className="em-card-hard p-5 text-left transition-transform hover:-translate-y-0.5" style={{ backgroundColor: bg }} onClick={onClick}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[14px] font-bold text-[var(--em-ink)]">{title}</span>
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--em-ink)] bg-white text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">{icon}</div>
      </div>
      <div className="em-display text-[42px] text-[var(--em-ink)]">{value}</div>
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  const bg = role === "TEACHER" ? "var(--em-lavender)" : role === "ADMIN" ? "var(--em-yellow-soft)" : "var(--em-mint)";
  return (
    <span className="inline-block rounded px-2.5 py-1 text-[11px] font-extrabold uppercase shadow-[1px_1px_0_0_#0E0F12]" style={{ backgroundColor: bg, border: "1px solid var(--em-ink)" }}>
      {roleLabels[role] ?? role}
    </span>
  );
}

function MenuButton({ icon, label, onClick, danger = false, disabled = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
        danger ? "text-[#b14545] hover:bg-[#fff1f1]" : "text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]"
      } disabled:cursor-not-allowed disabled:opacity-45`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`space-y-1.5 ${className}`}>
      <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--em-ink)]">{label}</span>
      {children}
    </label>
  );
}
