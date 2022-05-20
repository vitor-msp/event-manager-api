import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { CreateEventOutputDto } from "./CreateEventOutputDto";
import { EventBuilder } from "../../conversors/EventBuilder";
import { EventExtractor } from "../../conversors/EventExtractor";

export class CreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    eventData: IEvent,
    currentUserId: number
  ): Promise<CreateEventOutputDto> {

    const event = EventBuilder.buildEvent(eventData, currentUserId)

    if (eventData.guests?.length > 0)
      EventBuilder.setGuestsToEvent(eventData.guests, event)

    return await this.eventRepository.insert(
      EventExtractor.getDataFromEvent(event)
    );
  }
}
