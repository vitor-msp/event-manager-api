import { Request } from "express";
import { IEvent } from "../../app/interfaces/IEvent";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  validateDuration,
  validateEventId,
  validateGuests,
  validateGuestsToRemove,
  validateStart,
  validateTitle,
  validateUserId,
} from "./validators";

export const editEventValidator = (req: Request): void => {

  if (!req.query.userId) throw new InvalidRequestError("Missing User Id");
  validateUserId(req.query.userId);
  
  const input: IEvent = req.body;

  if (!input.id) throw new InvalidRequestError("Missing Event Id");
  validateEventId(input.id);

  if (
    !input.title &&
    !input.start &&
    !input.duration &&
    (!input.guests || input.guests.length === 0) &&
    (!input.guestsToRemove || input.guestsToRemove.length === 0)
  )
    throw new InvalidRequestError("Missing Fields To Edit");

  if (input.title) validateTitle(input.title);

  // @ts-ignore
  if (input.start) validateStart(input.start);

  if (input.duration) validateDuration(input.duration);

  if (input.guests?.length > 0) validateGuests(input.guests);

  if (input.guestsToRemove?.length! > 0) validateGuestsToRemove(input.guestsToRemove!);
};
