import { NextResponse } from 'next/server';
import {
  ACTIVITY_ATTACHMENT_MAX_FILES,
  resolveActivityAttachmentMimeType,
  validateActivityAttachmentFile,
} from '@/lib/activity-attachments';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const activityAttachmentSelect = {
  id: true,
  fileName: true,
  mimeType: true,
  sizeInBytes: true,
  createdAt: true,
} as const;

async function readActivityPayload(req: Request) {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();

    return {
      title: String(form.get('title') || '').trim(),
      description: String(form.get('description') || '').trim(),
      prompt: String(form.get('prompt') || '').trim(),
      tags: String(form.get('tags') || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      dueDate: String(form.get('dueDate') || '').trim(),
      status: String(form.get('status') || 'DRAFT').trim(),
      attachments: form.getAll('attachments').filter((item): item is File => item instanceof File && item.size > 0),
    };
  }

  const body = await req.json();

  return {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    prompt: String(body.prompt || '').trim(),
    tags: Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean) : [],
    dueDate: String(body.dueDate || '').trim(),
    status: String(body.status || 'DRAFT').trim(),
    attachments: [] as File[],
  };
}

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      attachments: {
        select: activityAttachmentSelect,
      },
      submissions: {
        select: { id: true },
      },
    },
  });

  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { title, description, prompt, tags, dueDate, status, attachments } = await readActivityPayload(req);

  if (!title || !description || !prompt) {
    return NextResponse.json({ error: 'Preencha titulo, descricao e enunciado da atividade.' }, { status: 400 });
  }

  if (attachments.length > ACTIVITY_ATTACHMENT_MAX_FILES) {
    return NextResponse.json(
      { error: `Voce pode anexar no maximo ${ACTIVITY_ATTACHMENT_MAX_FILES} materiais de apoio por atividade.` },
      { status: 400 },
    );
  }

  for (const attachment of attachments) {
    const validationError = validateActivityAttachmentFile(attachment);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
  }

  const nextStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  const attachmentData = await Promise.all(
    attachments.map(async (attachment) => ({
      fileName: attachment.name,
      mimeType: resolveActivityAttachmentMimeType(attachment) || attachment.type || 'application/octet-stream',
      sizeInBytes: attachment.size,
      fileData: Buffer.from(await attachment.arrayBuffer()),
    })),
  );

  const activity = await prisma.activity.create({
    data: {
      title,
      description,
      prompt,
      tags,
      status: nextStatus,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById: session.user.teacherId,
      publishedAt: nextStatus === 'PUBLISHED' ? new Date() : null,
      attachments: attachmentData.length
        ? {
            create: attachmentData,
          }
        : undefined,
    },
    include: {
      attachments: {
        select: activityAttachmentSelect,
      },
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
