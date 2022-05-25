import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";
import { GuestData } from "../../domain/types/GuestData";
import { Permission } from "../../domain/types/Permission";
import { IGuest } from "../interfaces/IGuest";

export abstract class SetGuestsToEvent {
  public static execute(
    guests: IGuest[],
    event: Event,
    currentUser: User
  ): void {
    const guestsData: GuestData[] = [];

    guests.forEach(({ user, permission }) =>
      guestsData.push({
        user: new User(user),
        permission: permission as Permission,
      })
    );

    event.setGuests(guestsData, currentUser);
  }
}
