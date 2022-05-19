export class InvalidFieldError extends Error {
  constructor(field: string) {
    super(`Invalid field: ${field}`);
  }
}