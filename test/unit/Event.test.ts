import { CreateEventData } from "../../src/domain/CreateEventData";
import { EditEventData } from "../../src/domain/EditEventData";
import { Event } from "../../src/domain/Event";
import { Guest } from "../../src/domain/Guest";
import { GuestData } from "../../src/domain/GuestData";
import { Permission } from "../../src/domain/Permission";
import { User } from "../../src/domain/User";

describe("Create Event", () => {
  const userCreator = new User(1);
  const eventBuilder = (start: Date): Event => {
    const oneHourInSeconds = 60 * 60;
    const eventData: CreateEventData = {
      start,
      duration: oneHourInSeconds,
      title: "Test Event",
    };
    const userId: number = 1;
    return new Event(eventData, userCreator);
  };

  it("should create event", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(eventStart);
    expect(duration).toBe(60 * 60);
    expect(title).toBe("Test Event");
    expect(creator).toEqual(userCreator);
  });

  it("should event data can be edited by creator", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const fiveMinutesInMs = 5 * 60 * 1000;
    const newEventStart = new Date(eventStart.getTime() + fiveMinutesInMs);
    const TenMinutesInSeconds = 10 * 60;
    const newEventData: EditEventData = {
      start: newEventStart,
      duration: TenMinutesInSeconds,
      title: "Test Event Edited",
    };
    event.setData(newEventData, userCreator);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(newEventStart);
    expect(duration).toBe(TenMinutesInSeconds);
    expect(title).toBe("Test Event Edited");
    expect(creator).toEqual(userCreator);
  });

  it("should creator can set guests", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const guests: GuestData[] = [];
    const user2 = new User(2);
    guests.push({
        user: user2,
        permission: Permission.Editor,
    });
    const user3 = new User(3);
    guests.push({
      user: user3,
      permission: Permission.Viewer,
    });
    event.setGuests(guests, userCreator);

    expect(event.getGuests()).toContainEqual(
      new Guest(event, user2, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, user3, Permission.Viewer)
    );
  });
});
