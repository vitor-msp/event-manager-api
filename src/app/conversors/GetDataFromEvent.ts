import { Event } from "../../domain/entities/Event";
import { IEvent } from "../interfaces/IEvent";
import { IGuest } from "../interfaces/IGuest";

export abstract class GetDataFromEvent {
  public static execute(event: Event): IEvent {
    const { id, start, duration, title, creator } = event.getData();

    const guests: IGuest[] = [];
    event.getGuests().forEach(({ user, permission }) =>
      guests.push({
        user: user.id,
        permission: permission.toString(),
      })
    );

    return {
      id,
      start,
      duration,
      title,
      creator: creator.id,
      guests,
    };
  }
}
