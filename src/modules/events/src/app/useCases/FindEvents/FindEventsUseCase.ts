import { IEvent } from "../../interfaces/IEvent";
import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { FindEventsIntputDto } from "./FindEventsIntputDto";
import { ISortEvents } from "../../utils/ISortEvents";

export class FindEventsUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly sortEvents: ISortEvents | null = null
  ) {}

  public async execute(
    periodDto: FindEventsIntputDto,
    currentUserId: number
  ): Promise<IEvent[]> {
    const { month, year } = periodDto;

    const events = await this.eventRepository.selectByPeriod({
      userId: currentUserId,
      month,
      year,
    });

    return this.sortEvents ? this.sortEvents.run(events) : events;
  }
}
