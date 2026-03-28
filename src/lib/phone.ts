function splitBrazilPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 13);

  if (digits.length > 11 || digits.startsWith('55')) {
    return {
      countryCode: digits.slice(0, 2),
      areaCode: digits.slice(2, 4),
      subscriberNumber: digits.slice(4),
    };
  }

  return {
    countryCode: '',
    areaCode: digits.slice(0, 2),
    subscriberNumber: digits.slice(2),
  };
}

export function normalizeWhatsAppNumber(value: string | null | undefined) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? digits.slice(0, 13) : '';
}

export function formatWhatsAppNumber(value: string | null | undefined) {
  const { countryCode, areaCode, subscriberNumber } = splitBrazilPhoneDigits(String(value ?? ''));

  if (!countryCode && !areaCode && !subscriberNumber) {
    return '';
  }

  let formatted = countryCode ? `+${countryCode}` : '';

  if (areaCode) {
    formatted += `${formatted ? ' ' : ''}(${areaCode}`;
    if (areaCode.length === 2) {
      formatted += ')';
    }
  }

  if (!subscriberNumber) {
    return formatted;
  }

  const separator = formatted ? ' ' : '';
  if (subscriberNumber.length <= 4) {
    return `${formatted}${separator}${subscriberNumber}`;
  }

  const isMobile = subscriberNumber.length > 8;
  const prefixLength = isMobile ? 5 : 4;
  const prefix = subscriberNumber.slice(0, prefixLength);
  const suffix = subscriberNumber.slice(prefixLength);

  return `${formatted}${separator}${prefix}${suffix ? `-${suffix}` : ''}`;
}
