import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpCreated,
  httpServerError,
} from "../../../../helpers/responses/httpResponses";
import { EmailInUseError } from "../../app/errors/EmailInUseError";
import { CreateUserInputDto } from "../../app/useCases/CreateUserInputDto";
import { CreateUserUseCase } from "../../app/useCases/CreateUserUseCase";
import { InvalidFieldError } from "../../domain/errors/InvalidFieldError";
import { createUserValidator } from "../validators/createUserValidator";

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      createUserValidator(req);

      const input: CreateUserInputDto = req.body;

      await this.createUserUseCase.execute(input);

      return httpCreated(res);
    } catch (error: any) {
      if (
        error instanceof InvalidRequestError ||
        error instanceof EmailInUseError ||
        error instanceof InvalidFieldError
      )
        return httpBadRequest(res, error);

      return httpServerError(res, error);
    }
  }
}
