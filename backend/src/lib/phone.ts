import { parsePhoneNumberWithError } from 'libphonenumber-js';

export const normalizePhone = (raw: string): string => {
  const p = parsePhoneNumberWithError(raw, 'EG');
  if (!p.isValid()) throw new Error('Invalid phone number');
  return p.number;
};
