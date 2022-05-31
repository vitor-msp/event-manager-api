import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpOk,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { authValidator } from "../validators/authValidator";

export class AuthController {
  // constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      authValidator(req);

      // const userId: number = +req.query.userId!;
      // const input: ChangePasswordInputDto = req.body;

      // await this.changePasswordUseCase.execute(userId, input);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      // if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      // if (error instanceof InvalidPasswordError)
      //   return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
