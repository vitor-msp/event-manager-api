import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import { validateUserId } from "./validators";

export const getUserDataValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");

  validateUserId(req.query.userId);
};
