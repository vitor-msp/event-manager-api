import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { CreateEventData } from "../../domain/types/CreateEventData";
import { EditEventData } from "../../domain/types/EditEventData";
import { GuestData } from "../../domain/types/GuestData";
import { Permission } from "../../domain/types/Permission";
import { IEvent } from "../interfaces/IEvent";
import { IGuest } from "../interfaces/IGuest";

export abstract class EventBuilder {
  public static buildEvent(event: IEvent, currentUser: User): Event {
    const { start, title } = event;
    const createEventData: CreateEventData = {
      start,
      duration: event.duration ?? undefined,
      title,
    };
    return new Event(createEventData, currentUser);
  }

  public static setGuestsToEvent(
    guests: IGuest[],
    event: Event,
    currentUser: User
  ): void {
    const guestsData: GuestData[] = [];

    guests.forEach(({ user, permission }) =>
      guestsData.push({
        user: new User(user),
        permission: permission as Permission,
      })
    );

    event.setGuests(guestsData, currentUser);
  }

  public static buildExistingEvent(event: IEvent): Event {
    const { id, creator, start, title, duration, guests } = event;

    const userCreator = new User(creator);
    const savedEvent = new Event(
      {
        id,
        title,
        start,
        duration,
      },
      userCreator
    );

    this.setGuestsToEvent(guests, savedEvent, userCreator);

    return savedEvent;
  }

  public static setDataToEvent(
    eventData: IEvent,
    event: Event,
    currentUser: User
  ): void {
    const editEventData: EditEventData = {
      title: eventData.title ?? null,
      start: eventData.start ?? null,
      duration: eventData.duration ?? null,
    };

    event.setData(editEventData, currentUser);
  }
}
