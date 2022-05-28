import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { EditEventData } from "../../domain/types/EditEventData";
import { IEvent } from "../interfaces/IEvent";

export abstract class SetDataToEvent {
  public static execute(
    eventData: IEvent,
    event: Event,
    currentUser: User
  ): void {
    const editEventData: EditEventData = {
      title: eventData.title ?? undefined,
      start: eventData.start ?? undefined,
      duration:
        eventData.duration !== null && eventData.duration !== undefined
          ? eventData.duration
          : undefined,
    };

    event.setData(editEventData, currentUser);
  }
}
