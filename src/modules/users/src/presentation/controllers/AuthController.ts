import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
  httpUnauthorized,
} from "../../../../../helpers/responses/httpResponses";
import { IncorrectPasswordError } from "../../app/errors/IncorrectPasswordError";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { AuthInputDto } from "../../app/useCases/Auth/AuthInputDto";
import { AuthUseCase } from "../../app/useCases/Auth/AuthUseCase";
import { authValidator } from "../validators/authValidator";

export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      authValidator(req);

      const input: AuthInputDto = req.body;

      const output = await this.authUseCase.execute(input);

      return httpOk(res, output);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      if (error instanceof IncorrectPasswordError)
        return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
