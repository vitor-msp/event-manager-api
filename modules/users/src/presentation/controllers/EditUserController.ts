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
import { editUserValidator } from "../validators/editUserValidator";

export class EditUserController {
  constructor(private readonly editUserUseCase: EditUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      editUserValidator(req);

      const userId: number = +req.query.userId!;
      const input: EditUserInputDto = req.body;

      await this.editUserUseCase.execute(userId, input);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      return httpServerError(res, error);
    }
  }
}
