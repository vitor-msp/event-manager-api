import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { App } from "../../../src/main/app";

describe("Create Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should return invalid request error missing title", async () => {
    const reqBody = {};

    const res: request.Response = await request(app)
      .post("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Title",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid title", async () => {
    const reqBody = {
      title: 1,
    };

    const res: request.Response = await request(app)
      .post("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Title",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error missing start", async () => {
    const reqBody = {
      title: "Event Test",
    };

    const res: request.Response = await request(app)
      .post("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Start",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid start", async () => {
    const reqBody = {
      title: "Event Test",
      start: "1",
    };

    const res: request.Response = await request(app)
      .post("/event")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Start",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });



  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
