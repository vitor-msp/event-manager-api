import { IGuest } from "../../interfaces/IGuest";

export type FindEventsOutputDto = {
  year: number;
  month: number;
  days: IDay[];
};

export type IDay = {
  day: number;
  events: IEvent[];
};

type IEvent = {
  id: number;
  start: Date;
  duration: number;
  title: string;
  creator: number;
  guests: IGuest[];
};
