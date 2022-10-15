import { Request, Response } from "express";
import { FindEventsIntputDto } from "../../app/useCases/FindEvents/FindEventsIntputDto";
import { FindEventsUseCase } from "../../app/useCases/FindEvents/FindEventsUseCase";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import { getDefaultPeriod } from "../helpers/getDefaultPeriod";
import {
  httpBadRequest,
  httpOk,
  httpServerError,
} from "../responses/httpResponses";
import { findEventsValidator } from "../validators/findEventsValidator";

export class FindEventsController {
  constructor(private readonly findEventsUseCase: FindEventsUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      findEventsValidator(req);

      const userId: number = +req.query.userId!;
      let input: FindEventsIntputDto = {
        //@ts-ignore
        month: req.query.month ? +req.query.month : undefined,
        //@ts-ignore
        year: req.query.year ? +req.query.year : undefined,
      };

      if (!input.month || !input.year) input = getDefaultPeriod();

      const events = await this.findEventsUseCase.execute(input, userId);

      return httpOk(res, events);
    } catch (error: any) {
      if (error instanceof InvalidRequestError)
        return httpBadRequest(res, error);

      return httpServerError(res, error);
    }
  }
}
