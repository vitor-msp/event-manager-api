import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { App } from "../../src/main/app";
import { CreateEventInputDto } from "../../src/app/useCases/CreateEvent/CreateEventInputDto";
import { IEvent } from "../../src/app/interfaces/IEvent";

describe("Create Event Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should receive bad request when create empty event", async () => {
    const reqBody: IEvent = {
      title: "Event Test",
      start: new Date(),
      duration: 60 * 60,
      guests: [
        { user: 2, permission: "Editor" },
        { user: 3, permission: "Viewer" },
      ],
    };

    const res: request.Response = await request(app)
      .post("/event")
      .send(reqBody);

    expect(res.statusCode).toEqual(201);
    console.log(res.body);
  });

  // it("should create event without a duration", () => {});

  // it("should create event and set guests", () => {});
  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
