import { EventData } from "../../src/domain/EventData";
import { Event } from "../../src/domain/Event";
import { User } from "../../src/domain/User";

describe("Create Event", () => {
  it("should create event", () => {
    const eventStart = new Date();
    const oneHourInSeconds = 60 * 60;
    const eventData: EventData = {
      start: eventStart,
      duration: oneHourInSeconds,
      title: "Test Event",
    };
    const userId: number = 1;
    const user = new User(userId);

    const event = new Event(eventData, user);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(eventStart);
    expect(duration).toBe(oneHourInSeconds);
    expect(title).toBe("Test Event");
    expect(creator).toEqual(user);
  });
});
