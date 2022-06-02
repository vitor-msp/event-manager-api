import { InvalidFieldError } from "./InvalidFieldError";

export class InvalidEmailError extends InvalidFieldError {
  constructor() {
    super("Invalid Email");
  }
}
