import { IEvent } from "../interfaces/IEvent";
import { FindEventsOutputDto } from "../useCases/FindEvents/FindEventsOutputDto";

export interface IPrepareOutputEvents {
  run(year: number, month: number, events: IEvent[]): FindEventsOutputDto;
}
