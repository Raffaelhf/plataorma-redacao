import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarClock, Radio, Video } from 'lucide-react';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { demoLiveClasses, isDemoSession, isDemoTeacherSession } from '@/lib/demo';
import { CreateLiveClass } from '@/components/live/create-live-class';
import { isTeacherRole } from '@/lib/roles';

function formatLiveDate(value: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function LiveClassesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  const isTeacher = isTeacherRole(session.user.role);
  const isDemo = isDemoSession(session);
  const now = new Date();

  const liveClasses = isDemo
    ? demoLiveClasses.slice().sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    : await prisma.liveClass.findMany({
        orderBy: { scheduledAt: 'asc' },
      });

  const happeningNow = liveClasses.filter((liveClass) => {
    const start = new Date(liveClass.scheduledAt).getTime();
    const end = start + 2 * 60 * 60 * 1000;
    const current = now.getTime();
    return current >= start && current <= end;
  });
  const upcoming = liveClasses.filter((liveClass) => new Date(liveClass.scheduledAt).getTime() > now.getTime());
  const past = liveClasses.filter((liveClass) => new Date(liveClass.scheduledAt).getTime() < now.getTime());

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1]">{isTeacher ? 'Agenda da turma' : 'Programação ao vivo'}</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Ao vivo</h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c]">
          {isTeacher
            ? 'Agende aulas ao vivo para revisar temas, fazer plantões de correção e orientar a turma com horário marcado.'
            : 'Veja quando será a próxima aula ao vivo, entre na sala no horário certo e acompanhe os encontros em tempo real.'}
        </p>
      </section>

      {isTeacher ? (
        <>
          <div className="rounded-[28px] border border-[#dde3fb] bg-white/80 p-4 text-sm text-[#5f6d98] shadow-[0_18px_45px_rgba(74,73,140,0.08)]">
            {isDemoTeacherSession(session)
              ? 'No modo teste, o agendamento é simulado. O aluno já consegue visualizar a agenda de exemplo nesta aba.'
              : 'Agende encontros com link da sala e mantenha o aluno informado sobre horário, tema e acesso.'}
          </div>
          <CreateLiveClass />
        </>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef9f4] text-[#1b7f62]">
            <Radio className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Acontecendo agora</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{happeningNow.length}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4]">
            <CalendarClock className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Próximas aulas</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{upcoming.length}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#ff7f32]">
            <Video className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Rotina das lives</p>
          <p className="text-sm leading-7 text-[#52618f]">Segundas-feiras quinzenais, 2 vezes por mês: iniciantes das 19:00 às 20:00 e nível médio das 20:00 às 21:30.</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[30px] border border-[#dde3fb] bg-white/85 p-5 shadow-[0_18px_45px_rgba(74,73,140,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1]">Programação fixa</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e]">Encontros ao vivo para tirar dúvidas</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f]">
            As lives acontecem quinzenalmente, sempre às segundas-feiras, para comentar dúvidas, revisar repertório e
            aprofundar os temas trabalhados nas aulas.
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[20px] bg-[#f5f7ff] px-4 py-3 text-sm font-semibold text-[#4250d4]">Iniciantes: 19:00 às 20:00</div>
            <div className="rounded-[20px] bg-[#fff4ee] px-4 py-3 text-sm font-semibold text-[#d86c35]">Nível médio: 20:00 às 21:30</div>
          </div>
        </article>
        <article className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1]">Conexão com o curso</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e]">Lives integradas ao clube de leitura</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f]">
            Parte dos encontros ao vivo também pode ser usada para comentar os livros indicados no clube de leitura,
            reforçando repertório cultural e leitura crítica.
          </p>
        </article>
      </section>

      {happeningNow.length ? (
        <section className="rounded-[30px] border border-[#d7ecdf] bg-[linear-gradient(180deg,rgba(246,255,250,0.98),rgba(236,250,242,0.94))] p-5 shadow-[0_20px_50px_rgba(27,127,98,0.08)]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#1b7f62]" />
            <h2 className="text-lg font-semibold text-[#23533c]">Aula acontecendo agora</h2>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {happeningNow.map((liveClass) => (
              <article key={liveClass.id} className="rounded-[24px] border border-[#cfe6d7] bg-white/90 p-4">
                <p className="text-base font-semibold text-[#23533c]">{liveClass.title}</p>
                <p className="mt-2 text-sm leading-7 text-[#3e6a53]">{liveClass.description}</p>
                <p className="mt-3 text-xs font-semibold text-[#1b7f62]">{formatLiveDate(liveClass.scheduledAt)}</p>
                {liveClass.meetingUrl ? (
                  <Link
                    href={liveClass.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1b7f62] px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Radio className="h-4 w-4" />
                    Entrar na aula
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
        <h2 className="text-lg font-semibold text-[#22347e]">Próximas aulas</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {upcoming.map((liveClass) => (
            <article key={liveClass.id} className="rounded-[24px] border border-[#e4e8f7] bg-white/90 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#22347e]">{liveClass.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#52618f]">{liveClass.description}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4]">
                  <CalendarClock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-[#4250d4]">{formatLiveDate(liveClass.scheduledAt)}</p>
              {liveClass.meetingUrl ? (
                <Link
                  href={liveClass.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4250d4]"
                >
                  <Video className="h-4 w-4" />
                  Abrir sala
                </Link>
              ) : null}
            </article>
          ))}
          {!upcoming.length ? <p className="text-sm text-[#6d79a5]">Nenhuma aula ao vivo agendada no momento.</p> : null}
        </div>
      </section>

      {past.length ? (
        <section className="rounded-[30px] border border-[#dde3fb] bg-white/80 p-5 shadow-[0_18px_45px_rgba(74,73,140,0.08)]">
          <h2 className="text-lg font-semibold text-[#22347e]">Aulas anteriores</h2>
          <div className="mt-4 space-y-3">
            {past
              .slice()
              .reverse()
              .slice(0, 6)
              .map((liveClass) => (
                <article key={liveClass.id} className="rounded-2xl border border-[#e4e8f7] bg-white/90 p-4 text-sm text-[#52618f]">
                  <p className="font-semibold text-[#22347e]">{liveClass.title}</p>
                  <p className="mt-1">{formatLiveDate(liveClass.scheduledAt)}</p>
                </article>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
