export const gradeLevelOptions = [
  '6o ano do ensino fundamental',
  '7o ano do ensino fundamental',
  '8o ano do ensino fundamental',
  '9o ano do ensino fundamental',
  '1o ano do ensino medio',
  '2o ano do ensino medio',
  '3o ano do ensino medio',
] as const;

export function isValidGradeLevel(value: string) {
  return gradeLevelOptions.includes(value as (typeof gradeLevelOptions)[number]);
}
