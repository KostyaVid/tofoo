import escape from "escape-html";
import { ValidateError } from "./error";
import { Status, StatusTodo } from "./../types/types";

export function validateID(id: number | null) {
  return id === null ? null : id < 0 || id > 4294967295 ? null : id;
}

export function validateIDNotNull(id: number) {
  if (id < 0 || id > 4294967295) throw new ValidateError("invalid id");
  return id;
}

export function validateStatus(status: Status) {
  if (status === "Opened" || status === "In Progress" || status === "Done")
    return status;
  throw new ValidateError("invalid status");
}

export function validateStatusTodo(status: StatusTodo) {
  if (
    status === "Opened" ||
    status === "In Progress" ||
    status === "Done" ||
    status === "Reviewer" ||
    status === "Reopened"
  )
    return status;
  throw new ValidateError("invalid status Todo");
}

export function toMySqlDate(date: string) {
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

export function dateToMySqlDate(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function spliceString(str: string, limit: number) {
  const strIn = escape(str);
  return strIn.length > limit ? strIn.slice(0, limit - 1) : strIn;
}
