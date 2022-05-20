import { Request, Response } from "express";
import { IEvent } from "../../app/interfaces/IEvent";
import { CreateEventOutputDto } from "../../app/useCases/CreateEvent/CreateEventOutputDto";
import { CreateEventUseCase } from "../../app/useCases/CreateEvent/CreateEventUseCase";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  httpBadRequest,
  httpCreated,
  httpServerError,
} from "../responses/httpResponses";
import { createEventValidator } from "../validators/createEventValidator";

export class CreateEventController {
  constructor(private readonly createEventUseCase: CreateEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      createEventValidator(req);
      const input: IEvent = req.body;
      const userId: number = +req.params.id;

      const output: CreateEventOutputDto =
        await this.createEventUseCase.execute(input, userId);

      return httpCreated(res, output);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      return httpServerError(res, error);
    }
  }
}
