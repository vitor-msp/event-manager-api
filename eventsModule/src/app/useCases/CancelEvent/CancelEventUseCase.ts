import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { EventNotFoundError } from "../../errors/EventNotFoundError";
import { User } from "../../../domain/entities/User";
import { BuildExistingEvent } from "../../conversors/BuildExistingEvent";
import { UserCannotCancelEvent } from "../../errors/UserCannotCancelEvent";

export class CancelEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(eventId: number, currentUserId: number): Promise<void> {
    const eventEnt: IEvent | null = await this.eventRepository.select(eventId);

    if (!eventEnt) throw new EventNotFoundError();

    const event = BuildExistingEvent.execute(eventEnt);

    const currentUser = new User(currentUserId);

    if (!event.canTheUserCancel(currentUser)) throw new UserCannotCancelEvent();
    
    await this.eventRepository.delete(event.getData().id!);
  }
}
