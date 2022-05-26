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
  await EventModel.deleteMany();
});

describe("Case Event Not Found", () => {
  it("should receive not found for an inexisting event", async () => {
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

  (async () => {
    await EventModel.deleteMany();
  })();
});



afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  app = null;
});
