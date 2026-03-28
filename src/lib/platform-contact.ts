import { prisma } from './prisma';
import { formatWhatsAppNumber, normalizeWhatsAppNumber } from './phone';

const DEFAULT_WHATSAPP_NUMBER = '+55 83 9855-2773';
const DEFAULT_WHATSAPP_HREF = buildWhatsAppHref(DEFAULT_WHATSAPP_NUMBER) ?? 'https://wa.me/558398552773';

export function buildWhatsAppHref(whatsappNumber: string | null | undefined) {
  const digitsOnly = normalizeWhatsAppNumber(whatsappNumber);
  return digitsOnly ? `https://wa.me/${digitsOnly}` : null;
}

export async function getPlatformWhatsAppContact() {
  const fallbackNumber = normalizeWhatsAppNumber(DEFAULT_WHATSAPP_NUMBER);

  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform' },
      select: { whatsappNumber: true },
    });

    const normalizedNumber = normalizeWhatsAppNumber(settings?.whatsappNumber) || fallbackNumber;
    return normalizedNumber
      ? {
          href: buildWhatsAppHref(normalizedNumber),
          label: formatWhatsAppNumber(normalizedNumber),
        }
      : null;
  } catch {
    return fallbackNumber
      ? {
          href: buildWhatsAppHref(fallbackNumber),
          label: formatWhatsAppNumber(fallbackNumber),
        }
      : null;
  }
}

export async function getPlatformWhatsAppHref() {
  return (await getPlatformWhatsAppContact())?.href ?? DEFAULT_WHATSAPP_HREF;
}
