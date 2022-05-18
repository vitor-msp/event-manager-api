import { CreateEventData } from "./CreateEventData";
import { EditEventData } from "./EditEventData";
import { EventMaster } from "./EventMaster";
import { Guest } from "./Guest";
import { GuestData } from "./GuestData";
import { User } from "./User";

export class Event extends EventMaster {
  private readonly id: number;
  private start: Date;
  private duration: number;
  private title: string;
  private readonly creator: User;
  private guests: Guest[];

  constructor(data: CreateEventData, whoIsCreating: User) {
    super();
    this.id = super.getNexId();
    const { start, title } = data;
    this.start = start;
    this.duration = data.duration ?? 0;
    this.title = title;
    this.creator = whoIsCreating;
    this.guests = [];
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

  public setData(data: EditEventData, whoIsEditing: User): void {
    if (whoIsEditing === this.creator) {
      if (data.start) this.start = data.start;
      if (data.duration) this.duration = data.duration;
      if (data.title) this.title = data.title;
    }
  }

  public setGuests(guestsData: GuestData[], whoIsEditing: User): void {
    if (whoIsEditing === this.creator) {
      guestsData.forEach(({ user, permission }) =>
        this.guests.push(new Guest(this, user, permission))
      );
    }
  }

  public getGuests(): Guest[] {
    return this.guests;
  }

  public removeGuests(guests: User[], whoIsEditing: User): void {
    if (whoIsEditing === this.creator) {
      for (const guest of guests) {
        this.guests = this.guests.filter(({user}) => user !== guest)
      }
    }
  };
}
