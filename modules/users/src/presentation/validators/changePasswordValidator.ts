import { Request } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import { ChangePasswordInputDto } from "../../app/useCases/ChangePassword/ChangePasswordInputDto";
import { validateUserId } from "./validators";

export const changePasswordValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);

  const input: ChangePasswordInputDto = req.body;

  if (!input.currentPassword) throw new InvalidRequestError("Missing Current Password");

  if (!input.newPassword) throw new InvalidRequestError("Missing New Password");
};
