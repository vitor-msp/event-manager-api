import { IGuest } from "../../app/interfaces/IGuest";
import { InvalidRequestError } from "../errors/InvalidRequestError";

export const validateTitle = (title: string): void => {
  if (typeof title !== "string")
    throw new InvalidRequestError("Invalid Title");
};

export const validateStart = (start: Date): void => {
  if (!(start instanceof Date)) throw new InvalidRequestError("Invalid Start");
};

export const validateDuration = (duration: number): void => {
  if (typeof duration !== "number")
    throw new InvalidRequestError("Invalid Duration");
};

export const validateGuests = (guests: IGuest[]): void => {
  guests.forEach((g) => validateGuest(g));
};

const validateGuest = (guest: IGuest): void => {
  if (
    guest.user &&
    guest.permission &&
    typeof guest.user === "number" &&
    (guest.permission === "Editor" || guest.permission === "Viewer")
  ) {
    return;
  }
  throw new InvalidRequestError("Invalid Guest");
};

export const validateUserId = (id: number): void => {
  if (typeof id !== "number") throw new InvalidRequestError("Invalid User id");
};