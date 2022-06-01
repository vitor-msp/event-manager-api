import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";

describe("Cancel Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppEvents().run()).express;
  });

  it("should return invalid request error missing user id", async () => {
    const reqBody = {};
    const res: request.Response = await request(app)
      .delete("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid user id", async () => {
    const reqBody = {};

    const res: request.Response = await request(app)
      .delete("/event")
      .query({ userId: "a" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error missing event id", async () => {
    const reqBody = {};
    const res: request.Response = await request(app)
      .delete("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Event Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid event id", async () => {
    const reqBody = { eventId: "a" };
    const res: request.Response = await request(app)
      .delete("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Event Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
