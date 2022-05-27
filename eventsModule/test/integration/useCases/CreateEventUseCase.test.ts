import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { IEvent } from "../../../src/app/interfaces/IEvent";
import { App } from "../../../../main/app";

describe("Create Event Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should receive created for a valid event containing guests", async () => {
    const eventStart = new Date().toISOString();
    const reqBody = {
      title: "Event Test",
      start: eventStart,
      duration: 60 * 60,
      guests: [
        { user: 1, permission: "Editor" },
        { user: 2, permission: "Editor" },
        { user: 3, permission: "Viewer" },
      ],
    };

    const res: request.Response = await request(app)
      .post("/event")
      .query({ userId: "1" })
      .send(reqBody);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("eventId");
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(1);
    expect(title).toBe("Event Test");
    expect(start.toISOString()).toBe(eventStart);
    expect(duration).toBe(60 * 60);
    expect(guests.length.toString()).toBe("2");
    expect(guests.toString()).toEqual(
      "{ user: 2, permission: 'Editor' },{ user: 3, permission: 'Viewer' }"
    );
  });

  afterAll(async () => {
    await EventModel.deleteMany();
    mongoose.disconnect();
    app = null;
  });
});
