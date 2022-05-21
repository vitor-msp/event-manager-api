import { CreateEventData } from "../../src/domain/types/CreateEventData";
import { CreatorCannotExitError } from "../../src/domain/errors/CreatorCannotExitError";
import { EditEventData } from "../../src/domain/types/EditEventData";
import { Event } from "../../src/domain/entities/Event";
import { Guest } from "../../src/domain/entities/Guest";
import { GuestData } from "../../src/domain/types/GuestData";
import { Permission } from "../../src/domain/types/Permission";
import { PermissionDeniedError } from "../../src/domain/errors/PermissionDeniedError";
import { User } from "../../src/domain/entities/User";
import { UserIsNotAGuestError } from "../../src/domain/errors/UserIsNotAGuestError";
import { InvalidFieldError } from "../../src/domain/errors/InvalidFieldError";

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

  it("should create event with a duration", () => {
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

  it("should create event without a duration", () => {
    const eventStart = new Date();
    const eventData: CreateEventData = {
      start: eventStart,
      title: "Test Event",
    };
    const event = new Event(eventData, userCreator);

    const { id, start, duration, title, creator } = event.getData();
    expect(id).toBe(1);
    expect(start).toBe(eventStart);
    expect(duration).toBe(0);
    expect(title).toBe("Test Event");
    expect(creator).toEqual(userCreator);
    expect(event.getGuests().length).toBe(0);
  });

  it("should not create event with a negative duration", () => {
    const eventStart = new Date();
    const eventData: CreateEventData = {
      start: eventStart,
      duration: -1,
      title: "Test Event",
    };

    expect(() => new Event(eventData, userCreator)).toThrow(InvalidFieldError);
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

  it("should not add creator as a guest", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const guests: GuestData[] = [];
    guests.push({
      user: userCreator,
      permission: Permission.Viewer,
    });
    guests.push({
      user: userEditor,
      permission: Permission.Editor,
    });
    event.setGuests(guests, userCreator);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(1);
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

  it("should not creator can exit of the event", () => {
    let event = eventBuilder(new Date());

    expect(() => event.exitOfTheEvent(userCreator)).toThrow(
      CreatorCannotExitError
    );

    expect(event.getData().id).toBe(1);
    expect(event.getData().creator).toEqual(userCreator);
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

  it("should not editor can cancel event", () => {
    let event = eventBuilder(new Date());

    const canCancel = event.canTheUserCancel(userEditor);

    expect(canCancel).toBe(false);
  });

  it("should editor can exit of the event", () => {
    let event = eventBuilder(new Date());

    event.exitOfTheEvent(userEditor);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests().length).toBe(1);
  });
});

describe("Event Manipulated by Viewer or Not Guest", () => {
  const userCreator = new User(1);
  const userEditor = new User(2);
  const userViewer = new User(3);
  const userNotGuest = new User(4);

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

  it("should not viewer/not guest can edit event data", () => {
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
    expect(() => event.setData(newEventData, userNotGuest)).toThrow(
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

  it("should not viewer/not guest can add guests", () => {
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
    expect(() => event.setGuests(guests, userNotGuest)).toThrow(
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

  it("should not viewer/not guest can remove guests", () => {
    const eventStart = new Date();
    let event = eventBuilder(eventStart);

    const guests: User[] = [];
    guests.push(userEditor);
    guests.push(userViewer);
    expect(() => event.removeGuests(guests, userViewer)).toThrow(
      PermissionDeniedError
    );
    expect(() => event.removeGuests(guests, userNotGuest)).toThrow(
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

  it("should not viewer/not guest can set guests permissions", () => {
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
    expect(() => event.setGuests(guests, userViewer)).toThrow(
      PermissionDeniedError
    );
    expect(() => event.setGuests(guests, userNotGuest)).toThrow(
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

  it("should not viewer/not guest can set guests permissions and add guests", () => {
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
    expect(() => event.setGuests(guests, userViewer)).toThrow(
      PermissionDeniedError
    );
    expect(() => event.setGuests(guests, userNotGuest)).toThrow(
      PermissionDeniedError
    );

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userViewer, Permission.Viewer)
    );
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(2);
  });

  it("should not viewer/not guest can cancel event", () => {
    let event = eventBuilder(new Date());

    const canViewerCancel = event.canTheUserCancel(userViewer);
    const canNotGuestCancel = event.canTheUserCancel(userNotGuest);

    expect(canViewerCancel).toBe(false);
    expect(canNotGuestCancel).toBe(false);
  });

  it("should viewer can exit of the event", () => {
    let event = eventBuilder(new Date());

    event.exitOfTheEvent(userViewer);

    expect(event.getData().id).toBe(1);
    expect(event.getGuests()).toContainEqual(
      new Guest(event, userEditor, Permission.Editor)
    );
    expect(event.getGuests().length).toBe(1);
  });

  it("should not a not guest can exit of the event", () => {
    let event = eventBuilder(new Date());

    expect(() => event.exitOfTheEvent(new User(5))).toThrow(
      UserIsNotAGuestError
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
