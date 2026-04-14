export const SERVERLESS_SAFE_UPLOAD_BYTES = 4 * 1024 * 1024;

function formatBytes(sizeInBytes: number) {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(sizeInBytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function getServerlessUploadLimitLabel() {
  return formatBytes(SERVERLESS_SAFE_UPLOAD_BYTES);
}

export function getServerlessUploadLimitMessage(targetLabel: string) {
  return `No deploy atual, o total de ${targetLabel} deve ter no maximo ${getServerlessUploadLimitLabel()} por envio. Reduza ou remova os arquivos maiores.`;
}
