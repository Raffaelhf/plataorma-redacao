import { NextResponse } from 'next/server';
import {
  ACTIVITY_ATTACHMENT_MAX_FILES,
  resolveActivityAttachmentMimeType,
  validateActivityAttachmentFile,
} from '@/lib/activity-attachments';
import { getAuthSession } from '@/lib/auth';
import { isAdminRole, isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';
import { SERVERLESS_SAFE_UPLOAD_BYTES, getServerlessUploadLimitMessage } from '@/lib/upload-limits';

type RouteContext = { params: Promise<{ id: string }> };

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
      removeAttachmentIds: form.getAll('removeAttachmentIds').map((value) => String(value)).filter(Boolean),
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
    removeAttachmentIds: Array.isArray(body.removeAttachmentIds)
      ? body.removeAttachmentIds.map((value: unknown) => String(value)).filter(Boolean)
      : [],
  };
}

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  const isStudent = session?.user?.role === 'STUDENT';
  const isAdmin = isAdminRole(session?.user?.role);
  const isTeacher = isTeacherRole(session?.user?.role);

  const activity = await prisma.activity.findFirst({
    where: {
      id,
      ...(isStudent
        ? { status: 'PUBLISHED' }
        : isTeacher && !isAdmin
          ? { createdById: session?.user?.teacherId ?? '__teacher_without_profile__' }
          : {}),
    },
    include: {
      attachments: {
        select: activityAttachmentSelect,
      },
      submissions: {
        include: {
          student: { include: { user: true } },
          corrections: { include: { teacher: { include: { user: true } } } },
        },
      },
    },
  });

  if (!activity) {
    return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 });
  }

  return NextResponse.json(activity);
}

export async function PUT(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await readActivityPayload(req);
  const isAdmin = isAdminRole(session.user.role);
  const currentActivity = await prisma.activity.findUnique({
    where: { id },
    select: {
      createdById: true,
      publishedAt: true,
      status: true,
      attachments: {
        select: { id: true },
      },
    },
  });

  if (!currentActivity) {
    return NextResponse.json({ error: 'Atividade nao encontrada' }, { status: 404 });
  }

  if (!isAdmin && currentActivity.createdById !== session.user.teacherId) {
    return NextResponse.json({ error: 'Voce nao pode editar esta atividade.' }, { status: 403 });
  }

  if (!body.title || !body.description || !body.prompt) {
    return NextResponse.json({ error: 'Preencha titulo, descricao e enunciado da atividade.' }, { status: 400 });
  }

  for (const attachment of body.attachments) {
    const validationError = validateActivityAttachmentFile(attachment);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
  }

  const totalAttachmentBytes = body.attachments.reduce((sum, attachment) => sum + attachment.size, 0);
  if (totalAttachmentBytes > SERVERLESS_SAFE_UPLOAD_BYTES) {
    return NextResponse.json({ error: getServerlessUploadLimitMessage('arquivos de apoio') }, { status: 400 });
  }

  const existingAttachmentIds = new Set<string>(currentActivity.attachments.map((attachment) => attachment.id));
  const removeAttachmentIds = [...new Set<string>(body.removeAttachmentIds)].filter((attachmentId) => existingAttachmentIds.has(attachmentId));
  const attachmentCountAfterUpdate = currentActivity.attachments.length - removeAttachmentIds.length + body.attachments.length;

  if (attachmentCountAfterUpdate > ACTIVITY_ATTACHMENT_MAX_FILES) {
    return NextResponse.json(
      { error: `Voce pode manter no maximo ${ACTIVITY_ATTACHMENT_MAX_FILES} materiais de apoio por atividade.` },
      { status: 400 },
    );
  }

  const nextStatus = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  const nextTags = Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === 'string' && tag.trim().length > 0) : [];
  const attachmentCreateData = await Promise.all(
    body.attachments.map(async (attachment) => ({
      fileName: attachment.name,
      mimeType: resolveActivityAttachmentMimeType(attachment) || attachment.type || 'application/octet-stream',
      sizeInBytes: attachment.size,
      fileData: Buffer.from(await attachment.arrayBuffer()),
    })),
  );

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      prompt: body.prompt,
      tags: nextTags,
      status: nextStatus,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      publishedAt: nextStatus === 'PUBLISHED' ? currentActivity.publishedAt ?? new Date() : null,
      attachments:
        removeAttachmentIds.length || attachmentCreateData.length
          ? {
              ...(removeAttachmentIds.length
                ? {
                    deleteMany: {
                      id: { in: removeAttachmentIds },
                    },
                  }
                : {}),
              ...(attachmentCreateData.length
                ? {
                    create: attachmentCreateData,
                  }
                : {}),
            }
          : undefined,
    },
    include: {
      attachments: {
        select: activityAttachmentSelect,
      },
    },
  });

  return NextResponse.json(activity);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const isAdmin = isAdminRole(session.user.role);
  const currentActivity = await prisma.activity.findUnique({
    where: { id },
    select: { createdById: true },
  });

  if (!currentActivity) {
    return NextResponse.json({ error: 'Atividade nao encontrada' }, { status: 404 });
  }

  if (!isAdmin && currentActivity.createdById !== session.user.teacherId) {
    return NextResponse.json({ error: 'Voce nao pode excluir esta atividade.' }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.correction.deleteMany({
      where: {
        submission: {
          activityId: id,
        },
      },
    }),
    prisma.activityAttachment.deleteMany({ where: { activityId: id } }),
    prisma.submission.deleteMany({ where: { activityId: id } }),
    prisma.activity.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
