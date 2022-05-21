import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { EventBuilder } from "../../conversors/EventBuilder";
import { EventExtractor } from "../../conversors/EventExtractor";
import { EventNotFoundError } from "../../errors/EventNotFoundError";
import { User } from "../../../domain/entities/User";

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

    const event = EventBuilder.buildExistingEvent(eventEnt);

    const currentUser = new User(currentUserId);
    EventBuilder.setDataToEvent(eventData, event, currentUser);

    if (eventData.guests?.length > 0)
      EventBuilder.setGuestsToEvent(eventData.guests, event, currentUser);

    await this.eventRepository.update(EventExtractor.getDataFromEvent(event));
  }
}
