import { IEvent } from "../interfaces/IEvent";

export interface ISortEvents {
  run(events: IEvent[]): IEvent[];
}
