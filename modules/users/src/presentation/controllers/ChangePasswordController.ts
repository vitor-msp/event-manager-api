import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { ChangePasswordUseCase } from "../../app/useCases/ChangePassword/ChangePasswordUseCase";
import { changePasswordValidator } from "../validators/changePasswordValidator";

export class ChangePasswordController {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      changePasswordValidator(req);

      const userId: number = +req.query.userId!;
      // const input: EditUserInputDto = req.body;

      await this.changePasswordUseCase.execute(userId);

      return httpOk(res);
    } catch (error: any) {
      if (
        error instanceof InvalidRequestError
        // ||
        // error instanceof InvalidFieldError
      )
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      return httpServerError(res, error);
    }
  }
}
