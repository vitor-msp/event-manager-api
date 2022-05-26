import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { App } from "../../../src/main/app";

describe("Exit Of The Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should return invalid request error missing user id", async () => {
    const reqBody = {};
    const res: request.Response = await request(app)
      .put("/event/exit")
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
      .put("/event/exit")
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
      .put("/event/exit")
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
      .put("/event/exit")
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
