import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { GetDataFromEvent } from "../../conversors/GetDataFromEvent";
import { EventNotFoundError } from "../../errors/EventNotFoundError";
import { User } from "../../../domain/entities/User";
import { BuildExistingEvent } from "../../conversors/BuildExistingEvent";
import { SetGuestsToEvent } from "../../conversors/SetGuestsToEvent";
import { SetDataToEvent } from "../../conversors/SetDataToEvent";
import { RemoveGuestsFromEvent } from "../../conversors/RemoveGuestsFromEvent";

export class EditEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    eventData: IEvent,
    currentUserId: number
  ): Promise<void> {
    const eventEnt: IEvent | null = await this.eventRepository.select(
      eventData.id
    );

    if (!eventEnt) throw new EventNotFoundError();

    const event = BuildExistingEvent.execute(eventEnt);

    const currentUser = new User(currentUserId);
    SetDataToEvent.execute(eventData, event, currentUser);

    if (eventData.guestsToRemove?.length! > 0)
      RemoveGuestsFromEvent.execute(
        eventData.guestsToRemove!,
        event,
        currentUser
      );

    if (eventData.guests?.length > 0)
      SetGuestsToEvent.execute(eventData.guests, event, currentUser);

    await this.eventRepository.update(GetDataFromEvent.execute(event));
  }
}
