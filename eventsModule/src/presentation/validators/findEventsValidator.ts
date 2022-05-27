import { Request } from "express";
import { FindEventsIntputDto } from "../../app/useCases/FindEvents/FindEventsIntputDto";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import { validateMonth, validateUserId, validateYear } from "./validators";

export const findEventsValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);

  const input: FindEventsIntputDto = req.body;

  if (input.month && input.year) {
    validateMonth(input.month);
    validateYear(input.year);
  }
};
