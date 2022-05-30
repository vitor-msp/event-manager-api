import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import { EditUserInputDto } from "../../app/useCases/EditUser/EditUserInputDto";
import { validateUserId } from "./validators";

export const changePasswordValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);

  // const input: EditUserInputDto = req.body;

  // if (!input.name) throw new InvalidRequestError("Missing Fields To Edit");
};
