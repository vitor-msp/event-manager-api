import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";

describe("JWT Test", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
  });

  it("should receive forbidden when jwt was not sent", async () => {
    const res: request.Response = await request(app).get("/user").send();

    const errorResponse: ErrorResponse = {
      message: "Missing JWT",
    };
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive forbidden for a blank jwt", async () => {
    const res: request.Response = await request(app)
      .get("/user")
      .auth("", { type: "bearer" })
      .send();

    const errorResponse: ErrorResponse = {
      message: "Missing JWT",
    };
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
