import { redirect } from 'next/navigation';
import { AdminSettingsForm } from '@/components/admin/admin-settings-form';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminSettingsPage() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'platform' },
  });

  return (
    <div className="admin-shell space-y-6">
      <section className="admin-hero relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.92)_0%,rgba(41,44,132,0.82)_38%,rgba(89,67,188,0.5)_66%,rgba(226,151,123,0.16)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_78%_62%,rgba(255,164,120,0.14),transparent_20%)]" />
        <div className="relative">
          <div className="admin-chip inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white/90">
            Configuracoes administrativas
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_10px_28px_rgba(17,19,74,0.22)] sm:text-3xl">
            Financeiro e canais oficiais
          </h1>
          <p className="mt-4 max-w-[54rem] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,83,0.16),rgba(17,23,83,0.07))] px-5 py-4 text-sm leading-7 text-white/84 shadow-[0_18px_45px_rgba(18,20,77,0.16)] backdrop-blur-[10px]">
            Mantenha os dados bancarios e o WhatsApp da plataforma atualizados para que atendimento e recebimentos usem sempre o canal correto.
          </p>
        </div>
      </section>

      <AdminSettingsForm initialSettings={settings ?? {}} />
    </div>
  );
}
