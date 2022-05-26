import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { GetDataFromEvent } from "../../conversors/GetDataFromEvent";
import { EventNotFoundError } from "../../errors/EventNotFoundError";
import { User } from "../../../domain/entities/User";
import { BuildExistingEvent } from "../../conversors/BuildExistingEvent";

export class ExitOfTheEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(eventId: number, currentUserId: number): Promise<void> {
    const eventEnt: IEvent | null = await this.eventRepository.select(eventId);

    if (!eventEnt) throw new EventNotFoundError();

    const event = BuildExistingEvent.execute(eventEnt);

    const currentUser = new User(currentUserId);
    event.exitOfTheEvent(currentUser);

    await this.eventRepository.update(GetDataFromEvent.execute(event));
  }
}
