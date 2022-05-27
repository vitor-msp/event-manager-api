import { Request } from "express";
import { InvalidRequestError } from "../errors/InvalidRequestError";
import {
  validateEventId,
  validateUserId,
} from "./validators";

export const cancelEventValidator = (req: Request): void => {
  if (!req.query.userId) throw new InvalidRequestError("Missing User Id")
  validateUserId(req.query.userId);
  
  const eventId = req.body.eventId;

  if (!eventId) throw new InvalidRequestError("Missing Event Id");
  validateEventId(eventId);
};
