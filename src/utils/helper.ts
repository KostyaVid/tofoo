import escape from 'escape-html';
import { ValidateError } from './error';

export function validateID(id: number | null) {
  return id === null ? null : id < 0 || id > 4294967295 ? null : id;
}

export function validateIDNotNull(id: number) {
  if (id < 0 || id > 4294967295) throw new ValidateError('invalid id');
  return id;
}

export function toMySqlDate(date: string) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

export function dateToMySqlDate(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function spliceString(str: string, limit: number) {
  const strIn = escape(str);
  return strIn.length > limit ? strIn.slice(0, limit - 1) : strIn;
}
