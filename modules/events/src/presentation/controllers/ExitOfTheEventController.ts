import { Request, Response } from "express";
import { EventNotFoundError } from "../../app/errors/EventNotFoundError";
import { ExitOfTheEventUseCase } from "../../app/useCases/ExitOfTheEvent/ExitOfTheEventUseCase";
import { CreatorCannotExitError } from "../../domain/errors/CreatorCannotExitError";
import { UserIsNotAGuestError } from "../../domain/errors/UserIsNotAGuestError";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
  httpUnauthorized,
} from "../responses/httpResponses";
import { exitOfTheEventValidator } from "../validators/exitOfTheEventValidator";

export class ExitOfTheEventController {
  constructor(private readonly exitOfTheEventUseCase: ExitOfTheEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      exitOfTheEventValidator(req);
      const userId: number = +req.query.userId!;
      const eventId: number = req.body.eventId;

      await this.exitOfTheEventUseCase.execute(eventId, userId);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof EventNotFoundError) return httpNotFound(res, error);

      if (error instanceof CreatorCannotExitError || error instanceof UserIsNotAGuestError)
        return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
