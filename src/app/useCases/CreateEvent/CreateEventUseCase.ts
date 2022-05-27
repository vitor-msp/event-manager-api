import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { CreateEventOutputDto } from "./CreateEventOutputDto";
import { GetDataFromEvent } from "../../conversors/GetDataFromEvent";
import { User } from "../../../domain/entities/User";
import { BuildEvent } from "../../conversors/BuildEvent";
import { SetGuestsToEvent } from "../../conversors/SetGuestsToEvent";
import { IUsersService } from "../../../infra/usersService/IUsersService";

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly usersService: IUsersService
  ) {}

  public async execute(
    eventData: IEvent,
    currentUserId: number
  ): Promise<CreateEventOutputDto> {
    const currentUser = new User(currentUserId);
    const event = BuildEvent.execute(eventData, currentUser);

    if (eventData.guests?.length > 0) {
      const existingUsers: number[] = await this.usersService.filterExistingUsers(
        eventData.guests.map((g) => g.user)
      );

      eventData.guests = eventData.guests.filter(
        (g) => existingUsers.findIndex((u) => u === g.user) !== -1
      );

      SetGuestsToEvent.execute(eventData.guests, event, currentUser);
    }

    return await this.eventRepository.insert(GetDataFromEvent.execute(event));
  }
}
