import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { dataSource } from "../../../src/main/factory";

describe("Edit User Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
  });

  it("should return bad request: missing user id", async () => {
    const res: request.Response = await request(app).put("/user").send();

    const errorResponse: ErrorResponse = {
      message: "Missing User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: invalid user id", async () => {
    const res: request.Response = await request(app)
      .put("/user")
      .query({ userId: "a" })
      .send();

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: missing fields to edit", async () => {
    const res: request.Response = await request(app)
      .put("/user")
      .query({ userId: "1" })
      .send();

    const errorResponse: ErrorResponse = {
      message: "Missing Fields To Edit",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
