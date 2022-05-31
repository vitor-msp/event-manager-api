import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import { AuthInputDto } from "../../app/useCases/Auth/AuthInputDto";
import { validateEmail, validateUserId } from "./validators";

export const authValidator = (req: Request): void => {
  const input: AuthInputDto = req.body;

  if (!input.email) throw new InvalidRequestError("Missing Email");
  validateEmail(input.email);

  if (!input.password) throw new InvalidRequestError("Missing Password");
};
