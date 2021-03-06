import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import { CreateUserInputDto } from "../../app/useCases/CreateUser/CreateUserInputDto";
import { validateEmail, validatePassword } from "./validators";

export const createUserValidator = (req: Request): void => {
  const input: CreateUserInputDto = req.body;

  if (!input.name) throw new InvalidRequestError("Missing User Name");

  if (!input.email) throw new InvalidRequestError("Missing User Email");
  validateEmail(input.email.trim());

  if (!input.password) throw new InvalidRequestError("Missing User Password");
  validatePassword(input.password.trim());
};
