import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";

export const getUserDataValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
};
