import { CreatorCannotExitError } from "../errors/CreatorCannotExitError";
import { InvalidFieldError } from "../errors/InvalidFieldError";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";
import { UserIsNotAGuestError } from "../errors/UserIsNotAGuestError";
import { CreateEventData } from "../types/CreateEventData";
import { EditEventData } from "../types/EditEventData";
import { GuestData } from "../types/GuestData";
import { Permission } from "../types/Permission";
import { EventMaster } from "./EventMaster";
import { Guest } from "./Guest";
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
    const duration = data.duration ?? 0;
    if (duration < 0) throw new InvalidFieldError("duration");
    this.duration = duration;
    const { start, title } = data;
    this.start = start;
    this.title = title;
    this.creator = whoIsCreating;
    this.guests = [];
    this.id = data.id ?? super.getNexId();
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

  public getGuests(): Guest[] {
    return this.guests;
  }

  public canTheUserCancel(whoIsCanceling: User): boolean {
    return whoIsCanceling.id === this.creator.id;
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
      if (guestData.user.id === this.creator.id) return;
      const index: number = this.findGuestIndex(guestData.user);
      if (index === -1) {
        this.createGuest(guestData);
      } else {
        this.editGuest(index, guestData);
      }
    });
  }

  public removeGuests(guests: User[], whoIsEditing: User): void {
    if (!this.canTheUserEdit(whoIsEditing)) throw new PermissionDeniedError();
    for (const guest of guests) {
      this.guests = this.guests.filter(({ user }) => user.id !== guest.id);
    }
  }

  public exitOfTheEvent(whoIsExiting: User): void {
    if (this.creator.id === whoIsExiting.id) throw new CreatorCannotExitError();
    if (this.findGuestIndex(whoIsExiting) === -1)
      throw new UserIsNotAGuestError();
    this.guests = this.guests.filter((g) => g.user.id !== whoIsExiting.id);
  }

  private canTheUserEdit(user: User): boolean {
    if (user.id === this.creator.id) return true;
    const index = this.findGuestIndex(user);
    if (index === -1) return false;
    if (this.guests[index].permission === Permission.Editor) return true;
    return false;
  }

  private findGuestIndex(user: User): number {
    return this.guests.findIndex((g) => g.user.id === user.id);
  }

  private editGuest(index: number, guestData: GuestData): void {
    const { user, permission } = guestData;
    this.guests[index] = new Guest(this, user, permission);
  }

  private createGuest(guestData: GuestData): void {
    const { user, permission } = guestData;
    this.guests.push(new Guest(this, user, permission));
  }
}
