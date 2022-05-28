import { Event } from "../../domain/entities/Event";
import { User } from "../../domain/entities/User";

export abstract class RemoveGuestsFromEvent {
  public static execute(
    idGuestsToRemove: number[],
    event: Event,
    currentUser: User
  ): void {
    const guestsToRemove: User[] = [];

    idGuestsToRemove.forEach((id) => guestsToRemove.push(new User(id)));

    event.removeGuests(guestsToRemove, currentUser);
  }
}
