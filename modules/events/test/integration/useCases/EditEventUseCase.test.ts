import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { AppUsers } from "../../../../users/test/integration/mocks/appUsers.mock";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { IEvent } from "../../../src/app/interfaces/IEvent";
import { dataSource } from "../../../../users/src/main/factory";
import { UserEntity } from "../../../../users/src/infra/database/schemas/UserEntity";
import { insertUser } from "../mocks/insertUser.mock";

let eventsApp: express.Application | null;
let usersApp: express.Application | null;
let userId1: number, userId2: number, userId3: number, userId4: number;

beforeAll(async () => {
  eventsApp = (await new AppEvents().run()).express;
  usersApp = (await new AppUsers().run()).express;
  await dataSource.getRepository(UserEntity).clear();
  [userId1, userId2, userId3, userId4] = await insertUsers();
});

const saveEvent = async (
  creatorId: number = 1,
  editorId: number = 2,
  viewerId: number = 3
) => {
  await EventModel.deleteMany();
  const startEvent = new Date();
  const event: IEvent = {
    id: 1,
    creator: creatorId,
    title: "Event Test",
    start: startEvent,
    duration: 60 * 60,
    guests: [
      { user: editorId, permission: "Editor" },
      { user: viewerId, permission: "Viewer" },
    ],
  };
  await EventModel.create(event);
};

// const insertUsers = async () => {
//   await dataSource
//     .createQueryBuilder()
//     .insert()
//     .into(UserEntity)
//     .values([
//       { id: 1, email: "1", name: "1", password: "1" },
//       { id: 2, email: "2", name: "2", password: "2" },
//       { id: 3, email: "3", name: "3", password: "3" },
//       { id: 4, email: "4", name: "4", password: "4" },
//     ])
//     .execute();
// };

const insertUsers = async (): Promise<number[]> => {
  const userId1 = await insertUser({
    email: "u1@teste.com",
    name: "u1",
    password: "teste",
  });

  const userId2 = await insertUser({
    email: "u2@teste.com",
    name: "u2",
    password: "teste",
  });

  const userId3 = await insertUser({
    email: "u3@teste.com",
    name: "u3",
    password: "teste",
  });

  const userId4 = await insertUser({
    email: "u4@teste.com",
    name: "u4",
    password: "teste",
  });

  return [userId1, userId2, userId3, userId4];
};

describe("Edit Event Use Case", () => {
  it("should receive not found for an inexisting event", async () => {
    await EventModel.deleteMany();
    const reqBody = {
      id: 1,
      title: "Event Edited",
    };

    const res: request.Response = await request(eventsApp)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Event Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive unauthorized when a not guest try edit an event", async () => {
    await saveEvent();
    const reqBody = {
      id: 1,
      title: "Event Edited",
    };

    const res: request.Response = await request(eventsApp)
      .put("/event")
      .query({ userId: "4" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Permission Denied!",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive unauthorized when viewer try edit an event", async () => {
    await saveEvent();
    const reqBody = {
      id: 1,
      title: "Event Edited",
    };

    const res: request.Response = await request(eventsApp)
      .put("/event")
      .query({ userId: "3" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Permission Denied!",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive ok when editor edit an event", async () => {
    await saveEvent(userId1, userId2, userId3);
    const newEventStart = new Date();
    const reqBody = {
      id: 1,
      title: "Event Test Edited",
      start: newEventStart,
      duration: 0,
      guests: [
        { user: userId2, permission: "Viewer" },
        { user: userId4, permission: "Editor" },
      ],
      guestsToRemove: [userId3],
    };

    const res: request.Response = await request(eventsApp)
      .put("/event")
      .query({ userId: userId2 })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(userId1);
    expect(title).toBe("Event Test Edited");
    expect(start.toISOString()).toBe(newEventStart.toISOString());
    expect(duration).toBe(0);
    expect(guests.toString()).toEqual(
      `{ user: ${userId2}, permission: 'Viewer' },{ user: ${userId4}, permission: 'Editor' }`
    );
  });

  it("should receive ok when creator edit an event", async () => {
    await saveEvent();
    const newEventStart = new Date();
    const reqBody = {
      id: 1,
      title: "Event Test Edited",
      start: newEventStart,
      duration: 0,
      guests: [
        { user: 4, permission: "Viewer" },
        { user: 3, permission: "Editor" },
      ],
      guestsToRemove: [2],
    };

    const res: request.Response = await request(eventsApp)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(1);
    expect(title).toBe("Event Test Edited");
    expect(start.toISOString()).toBe(newEventStart.toISOString());
    expect(duration).toBe(0);
    expect(guests.toString()).toEqual(
      "{ user: 3, permission: 'Editor' },{ user: 4, permission: 'Viewer' }"
    );
  });
});

afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  await dataSource.destroy();
  eventsApp = null;
  usersApp = null;
});