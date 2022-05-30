import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpCreated,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { EmailInUseError } from "../../app/errors/EmailInUseError";
import { CreateUserInputDto } from "../../app/useCases/CreateUser/CreateUserInputDto";
import { CreateUserUseCase } from "../../app/useCases/CreateUser/CreateUserUseCase";
import { InvalidFieldError } from "../../domain/errors/InvalidFieldError";
import { createUserValidator } from "../validators/createUserValidator";
import { editUserValidator } from "../validators/editUserValidator";

export class EditUserController {
  // constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      editUserValidator(req);

      // const input: CreateUserInputDto = req.body;

      // const output = await this.createUserUseCase.execute(input);

      return httpCreated(res, "output");
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      return httpServerError(res, error);
    }
  }
}
