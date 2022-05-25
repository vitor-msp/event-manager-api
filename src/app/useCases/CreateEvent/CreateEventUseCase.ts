import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { CreateEventOutputDto } from "./CreateEventOutputDto";
import { GetDataFromEvent } from "../../conversors/GetDataFromEvent";
import { User } from "../../../domain/entities/User";
import { BuildEvent } from "../../conversors/BuildEvent";
import { SetGuestsToEvent } from "../../conversors/SetGuestsToEvent";

export class CreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    eventData: IEvent,
    currentUserId: number
  ): Promise<CreateEventOutputDto> {
    const currentUser = new User(currentUserId);
    const event = BuildEvent.execute(eventData, currentUser);

    if (eventData.guests?.length > 0)
      SetGuestsToEvent.execute(eventData.guests, event, currentUser);

    return await this.eventRepository.insert(GetDataFromEvent.execute(event));
  }
}
