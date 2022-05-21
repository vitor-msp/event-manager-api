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

export const editEventValidator = (req: Request): void => {
  const input: IEvent = req.body;

  if (input.title) validateTitle(input.title);

  // @ts-ignore
  if (input.start) validateStart(input.start);

  if (input.duration) validateDuration(input.duration);

  if (input.guests?.length > 0) validateGuests(input.guests);

  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);
};
