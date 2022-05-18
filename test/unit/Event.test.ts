import { CreateEventData } from "../../src/domain/CreateEventData";
import { EditEventData } from "../../src/domain/EditEventData";
import { Event } from "../../src/domain/Event";
import { User } from "../../src/domain/User";

describe("Create Event", () => {
  const user = new User(1);
  const eventBuilder = (start: Date): Event => {
    const oneHourInSeconds = 60 * 60;
    const eventData: CreateEventData = {
      start,
      duration: oneHourInSeconds,
      title: "Test Event",
    };
    const userId: number = 1;
    return new Event(eventData, user);
  };

  it("should create event", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(eventStart);
    expect(duration).toBe(60 * 60);
    expect(title).toBe("Test Event");
    expect(creator).toEqual(user);
  });

  it("should creator can edit event data", () => {
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
    event.setData(newEventData, user);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(newEventStart);
    expect(duration).toBe(TenMinutesInSeconds);
    expect(title).toBe("Test Event Edited");
    expect(creator).toEqual(user);
  });
});
