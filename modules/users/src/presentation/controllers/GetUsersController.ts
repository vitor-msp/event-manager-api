import { Request, Response } from "express";
import {
  httpOk,
  httpServerError,
} from "../../../../../helpers/responses/httpResponses";
import { GetUsersUseCase } from "../../app/useCases/GetUsers/GetUsersUseCase";

export class GetUsersController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.getUsersUseCase.execute();

      return httpOk(res, output);
    } catch (error: any) {
      return httpServerError(res, error);
    }
  }
}
