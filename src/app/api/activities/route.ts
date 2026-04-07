import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';
import { ensureTeacherProfile } from '@/lib/teacher-profiles';

export const runtime = 'nodejs';

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: {
        select: { id: true },
      },
    },
  });

  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';
  let title = '';
  let description = '';
  let prompt = '';
  let tags: string[] = [];
  let dueDate: string | null = null;
  let status: 'DRAFT' | 'PUBLISHED' = 'DRAFT';
  let attachmentData: Buffer | null = null;
  let attachmentName: string | null = null;
  let attachmentMimeType: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    title = String(form.get('title') || '').trim();
    description = String(form.get('description') || '').trim();
    prompt = String(form.get('prompt') || '').trim();
    tags = String(form.get('tags') || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    dueDate = String(form.get('dueDate') || '').trim() || null;
    status = form.get('status') === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

    const attachment = form.get('attachment');
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > MAX_ATTACHMENT_SIZE) {
        return NextResponse.json({ error: 'O anexo deve ter no maximo 10 MB.' }, { status: 400 });
      }

      attachmentData = Buffer.from(await attachment.arrayBuffer());
      attachmentName = attachment.name || 'anexo';
      attachmentMimeType = attachment.type || 'application/octet-stream';
    }
  } else {
    const body = await req.json();
    title = String(body.title || '').trim();
    description = String(body.description || '').trim();
    prompt = String(body.prompt || '').trim();
    tags = Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean) : [];
    dueDate = typeof body.dueDate === 'string' && body.dueDate.trim() ? body.dueDate.trim() : null;
    status = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  }

  if (!title || !description || !prompt) {
    return NextResponse.json({ error: 'Preencha titulo, descricao e enunciado.' }, { status: 400 });
  }

  const teacherProfile = await ensureTeacherProfile(session.user.id);

  const activity = await prisma.activity.create({
    data: {
      title,
      description,
      prompt,
      tags,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      attachmentUrl: attachmentName ? '/pending-activity-attachment' : null,
      attachmentName,
      attachmentMimeType,
      attachmentData,
      createdById: teacherProfile.id,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });

  const responseActivity = activity.attachmentName
    ? await prisma.activity.update({
      where: { id: activity.id },
      data: {
        attachmentUrl: `/api/activities/${activity.id}/attachment`,
      },
    })
    : activity;

  return NextResponse.json(responseActivity, { status: 201 });
}
