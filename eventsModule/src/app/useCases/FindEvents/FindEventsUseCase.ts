import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { FindEventsIntputDto } from "./FindEventsIntputDto";

export class FindEventsUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  public async execute(
    periodDto: FindEventsIntputDto,
    currentUserId: number
  ): Promise<IEvent[]> {
    const { month, year } = periodDto;

    return await this.eventRepository.selectByPeriod({
      userId: currentUserId,
      month,
      year,
    });
  }
}
