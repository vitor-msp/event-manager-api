import * as EmailValidator from 'email-validator'
import { InvalidRequestError } from "../../../../helpers/errors/InvalidRequestError";

export const validateName = (name: any): void => {
  if (typeof name !== "string")
    throw new InvalidRequestError("Invalid User Name");
};

export const validateEmail = (email: any): void => {
  if (!EmailValidator.validate(email)) throw new InvalidRequestError("Invalid User Email");
};

export const validatePassword = (password: string): void => {
  if (password.length === 0) throw new InvalidRequestError("Password Is Blank");
};