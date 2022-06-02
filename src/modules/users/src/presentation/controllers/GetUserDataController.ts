import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { GetUserDataUseCase } from "../../app/useCases/GetUserData/GetUserDataUseCase";
import { getUserDataValidator } from "../validators/getUserDataValidator";

export class GetUserDataController {
  constructor(private readonly getUserDataUseCase: GetUserDataUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      getUserDataValidator(req);

      const userId: number = +req.query.userId!;

      const output = await this.getUserDataUseCase.execute(userId);

      return httpOk(res, output);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      return httpServerError(res, error);
    }
  }
}
