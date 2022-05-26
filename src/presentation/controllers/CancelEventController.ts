import { Request, Response } from "express";
import { EventNotFoundError } from "../../app/errors/EventNotFoundError";
import { UserCannotCancelEvent } from "../../app/errors/UserCannotCancelEvent";
import { CancelEventUseCase } from "../../app/useCases/CancelEvent/CancelEventUseCase";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
  httpUnauthorized,
} from "../responses/httpResponses";
import { cancelEventValidator } from "../validators/cancelEventValidator";

export class CancelEventController {
  constructor(private readonly cancelEventUseCase: CancelEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      cancelEventValidator(req);
      const userId: number = +req.query.userId!;
      const eventId = req.body.eventId;

      await this.cancelEventUseCase.execute(eventId, userId);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof EventNotFoundError) return httpNotFound(res, error);

      if (error instanceof UserCannotCancelEvent)
        return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
