import { IEvent } from "../interfaces/IEvent";
import {
  FindEventsOutputDto,
  IDay,
} from "../useCases/FindEvents/FindEventsOutputDto";
import { IPrepareOutputEvents } from "./IPrepareOutputEvents";

export class PrepareOutputEvents implements IPrepareOutputEvents {
  run(year: number, month: number, events: IEvent[]): FindEventsOutputDto {
    const sortedEvents = this.sort(events);

    const output: FindEventsOutputDto = {
      year,
      month,
      days: this.organizeEventsByDay(sortedEvents),
    };

    return output;
  }

  private sort(events: IEvent[]): IEvent[] {
    return events.sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });
  }

  private insertEventInDay(event: IEvent, day: IDay): IDay {
    const { id, title, start, duration, guests } = event;

    day.events.push({
      id,
      creator: event.creator!,
      title,
      start,
      duration,
      guests,
    });

    return day;
  }

  private organizeEventsByDay(events: IEvent[]): IDay[] {
    const output: IDay[] = [];

    let currentDay: IDay = {
      day: 1,
      events: [],
    };

    events.forEach((event) => {
      if (event.start.getDate() === currentDay.day) {
        currentDay = this.insertEventInDay(event, currentDay);
      } else if (event.start.getDate() > currentDay.day) {
        output.push(currentDay);
        
        currentDay = {
          day: event.start.getDate(),
          events: [],
        };
        
        currentDay = this.insertEventInDay(event, currentDay);
      }
    });
    
    output.push(currentDay);

    return output;
  }
}
