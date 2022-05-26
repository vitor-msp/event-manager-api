import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { App } from "../../../src/main/app";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { IEvent } from "../../../src/app/interfaces/IEvent";

let app: express.Application | null;
beforeAll(async () => {
  app = new App().express;
});

const saveEvent = async () => {
  await EventModel.deleteMany();
  const startEvent = new Date();
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

describe("Edit Event Use Case", () => {
  it("should receive not found for an inexisting event", async () => {
    await EventModel.deleteMany();
    const reqBody = {
      id: 1,
      title: "Event Edited",
    };

    const res: request.Response = await request(app)
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

    const res: request.Response = await request(app)
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

    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "3" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Permission Denied!",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });
});

afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  app = null;
});
