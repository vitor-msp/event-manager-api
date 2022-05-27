import { IGuest } from "../interfaces/IGuest";

export abstract class FilterExistingGuests {
  public static execute(guests: IGuest[], usersToFilter: number[]): IGuest[] {
    return guests.filter(
      (g) => usersToFilter.findIndex((u) => u === g.user) !== -1
    );
  }
}
