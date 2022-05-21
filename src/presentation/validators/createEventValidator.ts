import { Request } from "express";
import { IEvent } from "../../app/interfaces/IEvent";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  validateDuration,
  validateGuests,
  validateStart,
  validateTitle,
  validateUserId,
} from "./validators";

export const createEventValidator = (req: Request): void => {
  const input: IEvent = req.body;

  if (!req.query.userId) throw new InvalidRequestError("Missing User Id")
  validateUserId(req.query.userId);

  if (!input.title) throw new InvalidRequestError("Missing Title");
  validateTitle(input.title);

  if (!input.start) throw new InvalidRequestError("Missing Start");
  // @ts-ignore
  validateStart(input.start);

  if (input.duration) validateDuration(input.duration);

  if (input.guests?.length > 0) validateGuests(input.guests);
};
