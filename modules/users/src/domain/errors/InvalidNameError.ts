import { InvalidFieldError } from "./InvalidFieldError";

export class InvalidNameError extends InvalidFieldError {
  constructor() {
    super("Invalid Name");
  }
}
