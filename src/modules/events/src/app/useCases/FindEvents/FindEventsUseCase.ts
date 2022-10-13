import { IEventRepository } from "../../../infra/repositories/eventRepository/IEventRepository";
import { FindEventsIntputDto } from "./FindEventsIntputDto";
import { IPrepareOutputEvents } from "../../utils/IPrepareOutputEvents";
import { FindEventsOutputDto } from "./FindEventsOutputDto";

export class FindEventsUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly prepareOutputEvents: IPrepareOutputEvents
  ) {}

  public async execute(
    periodDto: FindEventsIntputDto,
    currentUserId: number
  ): Promise<FindEventsOutputDto> {
    const { month, year } = periodDto;

    const events = await this.eventRepository.selectByPeriod({
      userId: currentUserId,
      month,
      year,
    });

    return this.prepareOutputEvents.run(year, month, events);
  }
}
