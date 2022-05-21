import { IGuest } from "./IGuest";

export interface IEvent {
  id: number;
  start: Date;
  duration: number;
  title: string;
  creator: number;
  guests: IGuest[];
  guestsToRemove?: number[];
};