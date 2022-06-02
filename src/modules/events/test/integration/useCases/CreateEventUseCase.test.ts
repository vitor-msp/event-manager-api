import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { AppUsers } from "../../../../users/test/integration/mocks/appUsers.mock";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { IEvent } from "../../../src/app/interfaces/IEvent";
import { dataSource } from "../../../../users/src/main/factory";
import { insertUser } from "../mocks/insertUser.mock";
import { UserEntity } from "../../../../users/src/infra/database/schemas/UserEntity";

describe("Create Event Use Case", () => {
  let eventsApp: express.Application | null;
  let usersApp: express.Application | null;

  beforeAll(async () => {
    eventsApp = (await new AppEvents().run()).express;
    usersApp = (await new AppUsers().run()).express;
  });

  const insertUsers = async (): Promise<number[]> => {
    await dataSource.getRepository(UserEntity).clear();

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

    return [userId1, userId2, userId3];
  };

  it("should receive created for a valid event containing guests", async () => {
    const [userId1, userId2, userId3] = await insertUsers();
    const eventStart = new Date().toISOString();
    const reqBody = {
      title: "Event Test",
      start: eventStart,
      duration: 60 * 60,
      guests: [
        { user: userId1, permission: "Editor" },
        { user: userId2, permission: "Editor" },
        { user: userId3, permission: "Viewer" },
      ],
    };

    const res: request.Response = await request(eventsApp)
      .post("/event")
      .query({ userId: userId1 })
      .send(reqBody);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("eventId");
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(userId1);
    expect(title).toBe("Event Test");
    expect(start.toISOString()).toBe(eventStart);
    expect(duration).toBe(60 * 60);
    expect(guests.length.toString()).toBe("2");
    expect(guests.toString()).toEqual(
      `{ user: ${userId2}, permission: 'Editor' },{ user: ${userId3}, permission: 'Viewer' }`
    );
  });

  afterAll(async () => {
    await EventModel.deleteMany();
    mongoose.disconnect();
    await dataSource.destroy();
    eventsApp = null;
    usersApp = null;
  });
});
