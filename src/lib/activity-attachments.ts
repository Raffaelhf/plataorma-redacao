const attachmentExtensionToMimeType = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
} as const;

const allowedMimeTypes = new Set<string>(Object.values(attachmentExtensionToMimeType));

export const ACTIVITY_ATTACHMENT_ACCEPT = Object.keys(attachmentExtensionToMimeType).join(',');
export const ACTIVITY_ATTACHMENT_MAX_FILES = 6;
export const ACTIVITY_ATTACHMENT_MAX_SIZE_BYTES = 25 * 1024 * 1024;

function getFileExtension(fileName?: string | null) {
  const normalizedName = String(fileName || '').trim().toLowerCase();
  const lastDotIndex = normalizedName.lastIndexOf('.');

  if (lastDotIndex < 0) return '';
  return normalizedName.slice(lastDotIndex);
}

export function resolveActivityAttachmentMimeType(file: { name?: string | null; type?: string | null }) {
  const normalizedMimeType = String(file.type || '').trim().toLowerCase();
  if (normalizedMimeType && allowedMimeTypes.has(normalizedMimeType)) {
    return normalizedMimeType;
  }

  const extension = getFileExtension(file.name);
  return attachmentExtensionToMimeType[extension as keyof typeof attachmentExtensionToMimeType] ?? null;
}

export function getActivityAttachmentKindLabel(fileName?: string | null, mimeType?: string | null) {
  const resolvedMimeType = resolveActivityAttachmentMimeType({ name: fileName, type: mimeType });

  switch (resolvedMimeType) {
    case 'application/pdf':
      return 'PDF';
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word';
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'PowerPoint';
    case 'video/mp4':
    case 'video/webm':
    case 'video/quicktime':
      return 'Video';
    default:
      return 'Arquivo';
  }
}

export function validateActivityAttachmentFile(file: { name?: string | null; type?: string | null; size: number }) {
  if (!resolveActivityAttachmentMimeType(file)) {
    return 'Envie apenas videos, PDF, Word ou PowerPoint.';
  }

  if (file.size <= 0) {
    return 'O arquivo selecionado esta vazio.';
  }

  if (file.size > ACTIVITY_ATTACHMENT_MAX_SIZE_BYTES) {
    return `Cada anexo deve ter no maximo ${formatFileSize(ACTIVITY_ATTACHMENT_MAX_SIZE_BYTES)}.`;
  }

  return null;
}

export function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(sizeInBytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}
