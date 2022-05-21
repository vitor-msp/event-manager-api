import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { App } from "../../../src/main/app";

describe("Edit Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should return invalid request error invalid title", async () => {
    const reqBody = {
      title: 1,
    };

    const res: request.Response = await request(app)
      .put("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Title",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid start", async () => {
    const reqBody = {
      start: "1",
    };

    const res: request.Response = await request(app)
      .put("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Start",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid duration", async () => {
    const reqBody = {
      duration: "a",
    };

    const res: request.Response = await request(app)
      .put("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Duration",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest (missing user)", async () => {
    const reqBody = {
      guests: [{}],
    };

    const res: request.Response = await request(app)
      .put("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });


  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
