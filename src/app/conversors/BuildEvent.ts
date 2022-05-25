import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { CreateEventData } from "../../domain/types/CreateEventData";
import { IEvent } from "../interfaces/IEvent";

export abstract class BuildEvent {
  public static execute(event: IEvent, currentUser: User): Event {
    const { start, title } = event;
    const createEventData: CreateEventData = {
      start,
      duration: event.duration ?? undefined,
      title,
    };
    return new Event(createEventData, currentUser);
  }
}