import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { CreateEventData } from "../../domain/types/CreateEventData";
import { GuestData } from "../../domain/types/GuestData";
import { Permission } from "../../domain/types/Permission";
import { IEvent } from "../interfaces/IEvent";
import { IGuest } from "../interfaces/IGuest";

export abstract class EventBuilder {
  public static buildEvent(event: IEvent, currentUserId: number): Event {
    const { start, title } = event;
    const createEventData: CreateEventData = {
      start,
      duration: event.duration ?? undefined,
      title,
    };
    return new Event(createEventData, new User(currentUserId));
  }

  public static setGuestsToEvent(guests: IGuest[], event: Event): void {
    const guestsData: GuestData[] = [];
    guests.forEach(({ user, permission }) =>
      guestsData.push({
        user: new User(user),
        permission: permission as Permission,
      })
    );
    event.setGuests(guestsData, event.getData().creator);
  }
}