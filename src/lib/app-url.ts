export function getAppUrl() {
  const explicitUrl = process.env.NEXTAUTH_URL || process.env.APP_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl}`;
  }

  const vercelPreviewUrl = process.env.VERCEL_URL;
  if (vercelPreviewUrl) {
    return `https://${vercelPreviewUrl}`;
  }

  return null;
}
