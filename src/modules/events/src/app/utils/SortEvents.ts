import { IEvent } from "../interfaces/IEvent";
import { ISortEvents } from "./ISortEvents";

export class SortEvents implements ISortEvents {
  run(events: IEvent[]): IEvent[] {
    return events.sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });
  }
}
