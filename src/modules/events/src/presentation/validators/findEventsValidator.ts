import { Request } from "express";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import { validateMonth, validateUserId, validateYear } from "./validators";

export const findEventsValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);

  const month = req.query.month;
  const year = req.query.year;

  if (month && year) {
    //@ts-ignore
    validateMonth(month);
    //@ts-ignore
    validateYear(year);
  }
};
