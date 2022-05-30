import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpCreated,
  httpNotFound,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { EmailInUseError } from "../../app/errors/EmailInUseError";
import { UserNotFoundError } from "../../app/errors/UserNotFoundError";
import { CreateUserInputDto } from "../../app/useCases/CreateUser/CreateUserInputDto";
import { CreateUserUseCase } from "../../app/useCases/CreateUser/CreateUserUseCase";
import { EditUserInputDto } from "../../app/useCases/EditUser/EditUserInputDto";
import { EditUserUseCase } from "../../app/useCases/EditUser/EditUserUseCase";
import { InvalidFieldError } from "../../domain/errors/InvalidFieldError";
import { createUserValidator } from "../validators/createUserValidator";
import { editUserValidator } from "../validators/editUserValidator";

export class EditUserController {
  constructor(private readonly editUserUseCase: EditUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      editUserValidator(req);

      const userId: number = +req.query.userId!;
      // const input: EditUserInputDto = req.body;

      const output = await this.editUserUseCase.execute(userId);

      return httpCreated(res, "output");
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof UserNotFoundError) return httpNotFound(res, error);

      return httpServerError(res, error);
    }
  }
}
