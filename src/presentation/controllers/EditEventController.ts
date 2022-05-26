import { Request, Response } from "express";
import { EventNotFoundError } from "../../app/errors/EventNotFoundError";
import { IEvent } from "../../app/interfaces/IEvent";
import { EditEventUseCase } from "../../app/useCases/EditEvent/EditEventUseCase";
import { PermissionDeniedError } from "../../domain/errors/PermissionDeniedError";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  httpBadRequest,
  httpNotFound,
  httpOk,
  httpServerError,
  httpUnauthorized,
} from "../responses/httpResponses";
import { editEventValidator } from "../validators/editEventValidator";

export class EditEventController {
  constructor(private readonly editEventUseCase: EditEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      editEventValidator(req);
      const userId: number = +req.query.userId!;
      const input: IEvent = req.body;

      await this.editEventUseCase.execute(input, userId);

      return httpOk(res);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      if (error instanceof EventNotFoundError) return httpNotFound(res, error);

      if (error instanceof PermissionDeniedError)
        return httpUnauthorized(res, error);

      return httpServerError(res, error);
    }
  }
}
