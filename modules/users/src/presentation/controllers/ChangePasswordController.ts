import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
  httpUnauthorized,
} from "../../../../../helpers/responses/httpResponses";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { ChangePasswordInputDto } from "../../app/useCases/ChangePassword/ChangePasswordInputDto";
import { ChangePasswordUseCase } from "../../app/useCases/ChangePassword/ChangePasswordUseCase";
import { InvalidPasswordError } from "../../domain/errors/InvalidPasswordError";
import { changePasswordValidator } from "../validators/changePasswordValidator";

export class ChangePasswordController {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      changePasswordValidator(req);

      const userId: number = +req.query.userId!;
      const input: ChangePasswordInputDto = req.body;

      await this.changePasswordUseCase.execute(userId, input);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      if (error instanceof InvalidPasswordError)
        return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
