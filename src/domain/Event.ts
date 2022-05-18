import { CreateEventData } from "./CreateEventData";
import { EditEventData } from "./EditEventData";
import { EventMaster } from "./EventMaster";
import { Guest } from "./Guest";
import { GuestData } from "./GuestData";
import { Permission } from "./Permission";
import { PermissionDeniedError } from "./PermissionDeniedError";
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

  private canTheUserEdit(user: User): boolean {
    if (user === this.creator) return true;
    const editor = this.guests.find(
      (g) => g.user === user && g.getPermission() === Permission.Editor
    );
    if (editor) return true;
    return false;
  }

  public setData(data: EditEventData, whoIsEditing: User): void {
    if (!this.canTheUserEdit(whoIsEditing)) throw new PermissionDeniedError();
    if (data.start) this.start = data.start;
    if (data.duration) this.duration = data.duration;
    if (data.title) this.title = data.title;
  }

  public setGuests(guestsData: GuestData[], whoIsEditing: User): void {
    if (!this.canTheUserEdit(whoIsEditing)) throw new PermissionDeniedError();
    guestsData.forEach((guestData) => {
      const index: number = this.findGuestIndex(guestData.user);
      if (index === -1) {
        this.createGuest(guestData);
      } else {
        this.editGuest(index, guestData);
      }
    });
  }

  private findGuestIndex(user: User): number {
    return this.guests.findIndex((g) => g.user === user);
  }

  private editGuest(index: number, guestData: GuestData): void {
    const { user, permission } = guestData;
    this.guests[index] = new Guest(this, user, permission);
  }

  private createGuest(guestData: GuestData): void {
    const { user, permission } = guestData;
    this.guests.push(new Guest(this, user, permission));
  }

  public getGuests(): Guest[] {
    return this.guests;
  }

  public removeGuests(guests: User[], whoIsEditing: User): void {
    if (!this.canTheUserEdit(whoIsEditing)) throw new PermissionDeniedError();
    for (const guest of guests) {
      this.guests = this.guests.filter(({ user }) => user !== guest);
    }
  }

  public canTheUserCancel(whoIsCanceling: User): boolean {
    return whoIsCanceling === this.creator;
  }
}
