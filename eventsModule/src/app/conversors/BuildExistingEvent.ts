import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { IEvent } from "../interfaces/IEvent";
import { SetGuestsToEvent } from "./SetGuestsToEvent";

export abstract class BuildExistingEvent {
  public static execute(event: IEvent): Event {
    const { id, creator, start, title, duration, guests } = event;

    const userCreator = new User(creator!);
    const savedEvent = new Event(
      {
        id,
        title,
        start,
        duration,
      },
      userCreator
    );

    SetGuestsToEvent.execute(guests, savedEvent, userCreator);

    return savedEvent;
  }
}
