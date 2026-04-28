"use client";

import { useMemo, useState } from "react";
import { Award, ChevronLeft, ChevronRight, FileText, Mail, Search, TrendingUp, Users } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const STUDENTS = [
  { id: 1, name: "Ana Carolina", email: "ana@email.com", turma: "ENEM", status: "Ativo", entregas: 12, media: 860, evolucao: "+74" },
  { id: 2, name: "Lucas Moraes", email: "lucas@email.com", turma: "Fuvest", status: "Ativo", entregas: 8, media: 780, evolucao: "+41" },
  { id: 3, name: "Beatriz Silva", email: "bia@email.com", turma: "ENEM", status: "Atenção", entregas: 5, media: 640, evolucao: "-12" },
  { id: 4, name: "Rafael Costa", email: "rafael@email.com", turma: "Unicamp", status: "Ativo", entregas: 10, media: 820, evolucao: "+55" },
  { id: 5, name: "Mariana Souza", email: "mariana@email.com", turma: "ENEM", status: "Ativo", entregas: 14, media: 900, evolucao: "+92" },
  { id: 6, name: "Gabriel Lima", email: "gabriel@email.com", turma: "Tema livre", status: "Atenção", entregas: 3, media: 590, evolucao: "-20" },
  { id: 7, name: "Isabela Rocha", email: "isabela@email.com", turma: "Fuvest", status: "Ativo", entregas: 9, media: 760, evolucao: "+28" },
  { id: 8, name: "João Pedro", email: "joao@email.com", turma: "ENEM", status: "Ativo", entregas: 11, media: 810, evolucao: "+39" },
  { id: 9, name: "Clara Martins", email: "clara@email.com", turma: "Unicamp", status: "Atenção", entregas: 4, media: 620, evolucao: "+8" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function ProfessorAlunos() {
  const [query, setQuery] = useState("");
  const [turma, setTurma] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const search = normalize(query);
    return STUDENTS.filter((student) => {
      const matchesSearch = !search || normalize(`${student.name} ${student.email}`).includes(search);
      const matchesTurma = turma === "Todos" || student.turma === turma;
      const matchesStatus = status === "Todos" || student.status === status;
      return matchesSearch && matchesTurma && matchesStatus;
    });
  }, [query, status, turma]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const applyFilter = (nextTurma: string, nextStatus = "Todos") => {
    setTurma(nextTurma);
    setStatus(nextStatus);
    setPage(1);
  };

  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker={`Alunos - ${filtered.length} encontrados`}
      pageTitle="Acompanhe sua turma."
      primaryAction={{ label: "Correções", href: "/correcoes" }}
    >
      <div className="space-y-8 pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          <button type="button" onClick={() => applyFilter("Todos", "Ativo")} className="em-card-hard bg-[var(--em-mint)] p-5 text-left transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex items-center justify-between text-[var(--em-ink)]">
              <span className="text-sm font-bold">Alunos ativos</span>
              <Users className="h-5 w-5" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{STUDENTS.filter((item) => item.status === "Ativo").length}</div>
          </button>
          <button type="button" onClick={() => applyFilter("Todos", "Atenção")} className="em-card-hard bg-[var(--em-peach)] p-5 text-left transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex items-center justify-between text-[var(--em-ink)]">
              <span className="text-sm font-bold">Precisam de atenção</span>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{STUDENTS.filter((item) => item.status === "Atenção").length}</div>
          </button>
          <button type="button" onClick={() => applyFilter("ENEM")} className="em-card-hard bg-[var(--em-cream)] p-5 text-left transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex items-center justify-between text-[var(--em-ink)]">
              <span className="text-sm font-bold">Foco ENEM</span>
              <Award className="h-5 w-5" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{STUDENTS.filter((item) => item.turma === "ENEM").length}</div>
          </button>
        </div>

        <div className="em-card-hard bg-white p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[var(--em-ink)]"
                placeholder="Buscar aluno por nome ou e-mail..."
              />
            </div>
            <select className="em-chip bg-white outline-none" value={turma} onChange={(event) => applyFilter(event.target.value, status)}>
              {["Todos", "ENEM", "Fuvest", "Unicamp", "Tema livre"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select className="em-chip bg-white outline-none" value={status} onChange={(event) => applyFilter(turma, event.target.value)}>
              {["Todos", "Ativo", "Atenção"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="em-card-hard overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Aluno</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Turma</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Entregas</th>
                  <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Média</th>
                  <th className="p-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((student) => (
                  <tr key={student.id} className="border-b border-[var(--em-border)] transition-colors hover:bg-[var(--em-cream)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full border border-[var(--em-ink)] bg-[var(--em-peach)] text-xs font-bold text-[var(--em-ink)]">
                          {student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-[var(--em-ink)]">{student.name}</div>
                          <div className="text-xs font-semibold text-[var(--em-text-soft)]">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full border border-[var(--em-ink)] bg-[var(--em-bg)] px-3 py-1 text-xs font-extrabold text-[var(--em-ink)]">{student.turma}</span>
                    </td>
                    <td className="p-4 text-sm font-bold text-[var(--em-ink)]">{student.entregas} redações</td>
                    <td className="p-4 text-sm font-bold text-[var(--em-ink)]">
                      {student.media}/1000 <span className={student.evolucao.startsWith("-") ? "text-[#b14545]" : "text-[var(--em-green-deep)]"}>{student.evolucao}</span>
                    </td>
                    <td className="p-4 text-right">
                      <a href="/correcoes" className="inline-flex items-center gap-2 rounded-xl border border-[var(--em-ink)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)] hover:bg-[var(--em-yellow)]">
                        <FileText className="h-4 w-4" /> Ver redações
                      </a>
                      <a href={`mailto:${student.email}`} className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--em-border-strong)] bg-white text-[var(--em-ink)] hover:border-[var(--em-ink)]" aria-label={`Enviar e-mail para ${student.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--em-ink)] bg-[var(--em-bg)] p-4 text-sm font-bold text-[var(--em-text-soft)]">
            <span>Página {safePage} de {totalPages}</span>
            <div className="flex gap-2">
              <button className="rounded-xl border border-[var(--em-border-strong)] bg-white p-2 disabled:opacity-40" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-xl border border-[var(--em-border-strong)] bg-white p-2 disabled:opacity-40" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
