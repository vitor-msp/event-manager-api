import { CreateEventData } from "../../src/domain/CreateEventData";
import { EditEventData } from "../../src/domain/EditEventData";
import { Event } from "../../src/domain/Event";
import { Guest } from "../../src/domain/Guest";
import { GuestData } from "../../src/domain/GuestData";
import { Permission } from "../../src/domain/Permission";
import { PermissionDeniedError } from "../../src/domain/PermissionDeniedError";
import { User } from "../../src/domain/User";

describe("Event Manipulated by Creator", () => {
  const userCreator = new User(1);
  const userEditor = new User(2);
  const userViewer = new User(3);

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

  const setGuestsToEvent = (event: Event): Event => {
    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Editor,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Viewer,
    });
    event.setGuests(guests, userCreator);
    return event;
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
    expect(event.getGuests().length).toBe(0);
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
    event.setData(newEventData, userCreator);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(newEventStart);
    expect(duration).toBe(TenMinutesInSeconds);
    expect(title).toBe("Test Event Edited");
    expect(creator).toEqual(userCreator);
    expect(event.getGuests().length).toBe(0);
  });

  it("should creator can set guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    event = setGuestsToEvent(event);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should creator can remove guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);
    event = setGuestsToEvent(event);

    const guests: User[] = [];
    guests.push(userEditor);
    guests.push(userViewer);
    event.removeGuests(guests, userCreator);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests().length).toBe(0);
  });

  it("should creator can set guests permissions", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);
    event = setGuestsToEvent(event);

    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Viewer,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Editor,
    });
    event.setGuests(guests, userCreator);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should creator can set guests permissions and add guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);
    event = setGuestsToEvent(event);

    const user4 = new User(4);
    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Viewer,
    });
    guests.push({
      user: user4,
      permission: Permission.Editor,
    });
    event.setGuests(guests, userCreator);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, user4, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(3);
  });

  it("should creator can cancel event", () => {
    let event = eventBuilder(new Date());
    event = setGuestsToEvent(event);

    const canCancel = event.canTheUserCancel(userCreator);

    expect(canCancel).toBe(true);
  });
});

describe("Event Manipulated by Editor", () => {
  const userCreator = new User(1);
  const userEditor = new User(2);
  const userViewer = new User(3);

  const eventBuilder = (start: Date): Event => {
    const oneHourInSeconds = 60 * 60;
    const eventData: CreateEventData = {
      start,
      duration: oneHourInSeconds,
      title: "Test Event",
    };
    const userId: number = 1;
    let event = new Event(eventData, userCreator);
    event = setGuestsToEvent(event);
    return event;
  };

  const setGuestsToEvent = (event: Event): Event => {
    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Editor,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Viewer,
    });
    event.setGuests(guests, userCreator);
    return event;
  };

  it("should editor can edit event data", () => {
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
    event.setData(newEventData, userEditor);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(newEventStart);
    expect(duration).toBe(TenMinutesInSeconds);
    expect(title).toBe("Test Event Edited");
    expect(creator).toEqual(userCreator);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should editor can add guests", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const userEditor2 = new User(4);
    const guests: GuestData[] = [];
    guests.push({
      user: userEditor2,
      permission: Permission.Editor,
    });
    const userViewer2 = new User(5);
    guests.push({
      user: userViewer2,
      permission: Permission.Viewer,
    });
    event.setGuests(guests, userEditor);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor2, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer2, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(4);
  });

  it("should editor can remove guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const guests: User[] = [];
    guests.push(userEditor);
    guests.push(userViewer);
    event.removeGuests(guests, userEditor);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests().length).toBe(0);
  });

  it("should editor can set guests permissions", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Viewer,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Editor,
    });
    event.setGuests(guests, userEditor);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should editor can set guests permissions and add guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const user4 = new User(4);
    const guests: GuestData[] = [];
    guests.push({
      user: user4,
      permission: Permission.Viewer,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Editor,
    });
    event.setGuests(guests, userEditor);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, user4, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(3);
  });

  it("should editor cannot cancel event", () => {
    let event = eventBuilder(new Date());

    const canCancel = event.canTheUserCancel(userEditor);

    expect(canCancel).toBe(false);
  });
});

describe("Event Manipulated by Editor", () => {
  const userCreator = new User(1);
  const userEditor = new User(2);
  const userViewer = new User(3);

  const eventBuilder = (start: Date): Event => {
    const oneHourInSeconds = 60 * 60;
    const eventData: CreateEventData = {
      start,
      duration: oneHourInSeconds,
      title: "Test Event",
    };
    const userId: number = 1;
    let event = new Event(eventData, userCreator);
    event = setGuestsToEvent(event);
    return event;
  };

  const setGuestsToEvent = (event: Event): Event => {
    const guests: GuestData[] = [];
    guests.push({
      user: userEditor,
      permission: Permission.Editor,
    });
    guests.push({
      user: userViewer,
      permission: Permission.Viewer,
    });
    event.setGuests(guests, userCreator);
    return event;
  };

  it("should not viewer can edit event data", () => {
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
    expect(() => event.setData(newEventData, userViewer)).toThrow(
      PermissionDeniedError
    );

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(eventStart);
    expect(duration).toBe(60 * 60);
    expect(title).toBe("Test Event");
    expect(creator).toEqual(userCreator);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should not viewer can add guests", () => {
    const eventStart = new Date();
    const event = eventBuilder(eventStart);

    const user4 = new User(4);
    const guests: GuestData[] = [];
    guests.push({
      user: user4,
      permission: Permission.Editor,
    });
    expect(() => event.setGuests(guests, userViewer)).toThrow(
      PermissionDeniedError
    );

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should not viewer can remove guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const guests: User[] = [];
    guests.push(userEditor);
    guests.push(userViewer);
    expect(() => event.removeGuests(guests, userViewer)).toThrow(
      PermissionDeniedError
    );

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(2);
  });
});
