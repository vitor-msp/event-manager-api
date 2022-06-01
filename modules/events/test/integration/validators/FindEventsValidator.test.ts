import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { FindEventsIntputDto } from "../../../src/app/useCases/FindEvents/FindEventsIntputDto";

describe("Find Events Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppEvents().run()).express;
  });

  it("should return invalid request error missing user id", async () => {
    const reqBody = {};
    const res: request.Response = await request(app)
      .get("/event")
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
      .get("/event")
      .query({ userId: "a" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid month", async () => {
    const reqBody: FindEventsIntputDto = {
      //@ts-ignore
      month: "a",
      year: 2022
    };
    const res: request.Response = await request(app)
    .get("/event")
    .query({ userId: "1" })
    .send(reqBody);
    
    const errorResponse: ErrorResponse = {
      message: "Invalid Month",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });
  
  it("should return invalid request error invalid year", async () => {
    const reqBody: FindEventsIntputDto = {
      month: 5,
      //@ts-ignore
      year: "a",
    };
    const res: request.Response = await request(app)
      .get("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Year",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
