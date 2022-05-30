import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { EditUserInputDto } from "../../app/useCases/EditUser/EditUserInputDto";
import { EditUserUseCase } from "../../app/useCases/EditUser/EditUserUseCase";
import { InvalidFieldError } from "../../domain/errors/InvalidFieldError";
import { changePasswordValidator } from "../validators/changePasswordValidator";
import { editUserValidator } from "../validators/editUserValidator";

export class ChangePasswordController {
  // constructor(private readonly editUserUseCase: EditUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      changePasswordValidator(req);

      const userId: number = +req.query.userId!;
      // const input: EditUserInputDto = req.body;

      // await this.editUserUseCase.execute(userId, input);

      return httpOk(res);
    } catch (error: any) {
      if (
        error instanceof InvalidRequestError
        // ||
        // error instanceof InvalidFieldError
      )
        return httpBadRequest(res, error);

      // if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      return httpServerError(res, error);
    }
  }
}
