import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { App } from "../../../src/main/app";
import { IEvent } from "../../../src/app/interfaces/IEvent";

describe("Edit Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });
  const reqBody = {
    id: 1,
    title: "Event Test",
    start: new Date().toISOString(),
    duration: 1,
    guests: [{ user: 1, permission: "Editor" }],
    guestsToRemove: [1, 2],
  };

  it("should return invalid request error missing user id", async () => {
    const res: request.Response = await request(app)
      .put("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid user id", async () => {
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "a" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error Missing Fields To Edit", async () => {
    const reqBody = { id: 1 };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Fields To Edit",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
