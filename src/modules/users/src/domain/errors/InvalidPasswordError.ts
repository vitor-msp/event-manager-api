import { InvalidFieldError } from "./InvalidFieldError";

export class InvalidPasswordError extends InvalidFieldError {
  constructor() {
    super("Invalid Password");
  }
}
