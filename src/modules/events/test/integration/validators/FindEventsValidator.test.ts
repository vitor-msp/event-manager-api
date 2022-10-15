import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";

describe("Find Events Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppEvents().run()).express;
  });

  it("should return invalid request error missing user id", async () => {
    const reqQuery = {};
    const res: request.Response = await request(app)
      .get("/event")
      .query(reqQuery)
      .send();

    const errorResponse: ErrorResponse = {
      message: "Missing User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid user id", async () => {
    const reqQuery = { userId: "a" };

    const res: request.Response = await request(app)
      .get("/event")
      .query(reqQuery)
      .send();

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid month", async () => {
    const reqQuery = {
      userId: "1",
      month: "a",
      year: 2022,
    };
    const res: request.Response = await request(app)
      .get("/event")
      .query(reqQuery)
      .send();

    const errorResponse: ErrorResponse = {
      message: "Invalid Month",
    };
    console.log(res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });
  
  it("should return invalid request error invalid year", async () => {
    const reqQuery = {
      userId: "1",
      month: 5,
      year: "a",
    };
    const res: request.Response = await request(app)
    .get("/event")
    .query(reqQuery)
    .send();
    
    const errorResponse: ErrorResponse = {
      message: "Invalid Year",
    };
    console.log(res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
