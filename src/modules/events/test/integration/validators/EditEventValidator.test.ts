import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";

describe("Edit Event Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppEvents().run()).express;
  });

  it("should return invalid request error missing user id", async () => {
    const reqBody = {};
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
    const reqBody = {};

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

  it("should return invalid request error missing event id", async () => {
    const reqBody = {};
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Event Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid event id", async () => {
    const reqBody = { id: "a" };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Event Id",
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

  it("should return invalid request error invalid title", async () => {
    const reqBody = { id: 1, title: 1 };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Title",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid start", async () => {
    const reqBody = { id: 1, start: "1" };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Start",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid duration", async () => {
    const reqBody = { id: 1, duration: "a" };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Duration",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest (missing user)", async () => {
    const reqBody = { id: 1, guests: [{}] };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest (invalid user)", async () => {
    const reqBody = { id: 1, guests: [{ user: "a" }] };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest (missing permission)", async () => {
    const reqBody = { id: 1, guests: [{ user: 1 }] };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest (invalid permission)", async () => {
    const reqBody = { id: 1, guests: [{ user: 1, permission: "teste" }] };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return invalid request error invalid guest to remove", async () => {
    const reqBody = { id: 1, guestsToRemove: [1,2,"a",4] };
    const res: request.Response = await request(app)
      .put("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Guest To Remove",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
