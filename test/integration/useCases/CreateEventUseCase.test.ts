import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { App } from "../../../src/main/app";
import { IEvent } from "../../../src/app/interfaces/IEvent";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";

describe("Create Event Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should receive created for a valid event containing guests", async () => {
    const reqBody = {
      title: "Event Test",
      start: new Date().toISOString(),
      duration: 60 * 60,
      guests: [
        { user: 1, permission: "Editor" },
        { user: 3, permission: "Viewer" },
      ],
    };

    const res: request.Response = await request(app)
      .post("/event")
      .query({ userId: "1" })
      .send(reqBody);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("eventId");
  });

  it("should receive created for a valid event without guests", async () => {
    const reqBody = {
      title: "Event Test",
      start: new Date().toISOString(),
      duration: 60 * 60,
    };

    const res: request.Response = await request(app)
      .post("/event")
      .query({ userId: "1" })
      .send(reqBody);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("eventId");
  });

  afterAll(async () => {
    // await EventModel.deleteMany();
    mongoose.disconnect();
    app = null;
  });
});
