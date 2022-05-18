import { EventData } from "./EventData";
import { EventMaster } from "./EventMaster";
import { User } from "./User";

export class Event extends EventMaster {
  private id: number;
  private start: Date;
  private duration: number;
  private title: string;
  private creator: User;

  constructor(data: EventData, whoIsCreating: User) {
    super();
    this.id = super.getNexId();
    const { start, title } = data;
    this.start = start;
    this.duration = data.duration ?? 0;
    this.title = title;
    this.creator = whoIsCreating;
  }

  public getData() {
    return {
      id: this.id,
      start: this.start,
      duration: this.duration,
      title: this.title,
      creator: this.creator,
    };
  }
}
