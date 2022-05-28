import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { IEvent } from "../../../src/app/interfaces/IEvent";
import { App } from "../../../../../main/app";

let app: express.Application | null;
beforeAll(async () => {
  app = new App().express;
});

let startEvent: Date | null;
const saveEvent = async () => {
  await EventModel.deleteMany();
  startEvent = new Date();
  const event: IEvent = {
    id: 1,
    creator: 1,
    title: "Event Test",
    start: startEvent,
    duration: 60 * 60,
    guests: [
      { user: 2, permission: "Editor" },
      { user: 3, permission: "Viewer" },
    ],
  };
  await EventModel.create(event);
};

describe("Exit Of The Event Use Case", () => {
  it("should receive not found for an inexisting event", async () => {
    await EventModel.deleteMany();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .put("/event/exit")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Event Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive unauthorized when a not guest try exit of an event", async () => {
    await saveEvent();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .put("/event/exit")
      .query({ userId: "4" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "User Is Not A Guest!",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive unauthorized when creator try exit of an event", async () => {
    await saveEvent();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .put("/event/exit")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Creator Cannot Exit Of The Event!",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive ok when viewer exit of an event", async () => {
    await saveEvent();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .put("/event/exit")
      .query({ userId: "3" })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(1);
    expect(title).toBe("Event Test");
    expect(start.toISOString()).toBe(startEvent!.toISOString());
    expect(duration).toBe(60 * 60);
    expect(guests.toString()).toEqual(
      "{ user: 2, permission: 'Editor' }"
    );
  });

  it("should receive ok when editor exit of an event", async () => {
    await saveEvent();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .put("/event/exit")
      .query({ userId: "2" })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
    const { id, creator, title, start, duration, guests } = savedEvent!;
    expect(id).toBe(1);
    expect(creator).toBe(1);
    expect(title).toBe("Event Test");
    expect(start.toISOString()).toBe(startEvent!.toISOString());
    expect(duration).toBe(60 * 60);
    expect(guests.toString()).toEqual(
      "{ user: 3, permission: 'Viewer' }"
    );
  });

});

afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  app = null;
});
