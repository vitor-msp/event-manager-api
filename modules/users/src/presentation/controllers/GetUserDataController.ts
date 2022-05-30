import { Request, Response } from "express";
import { InvalidRequestError } from "../../../../../helpers/errors/InvalidRequestError";
import {
  httpBadRequest,
  httpCreated,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { getUserDataValidator } from "../validators/getUserDataValidator";

export class GetUserDataController {
  // constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      getUserDataValidator(req);

      // const input: CreateUserInputDto = req.body;

      // const output = await this.createUserUseCase.execute(input);

      return httpCreated(res, {});
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      return httpServerError(res, error);
    }
  }
}
