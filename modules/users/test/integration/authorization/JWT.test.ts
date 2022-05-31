import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { GenerateJwt } from "../../../src/app/helpers/GenerateJwt";

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

  it("should receive unauthorized for an invalid jwt", async () => {
    const res: request.Response = await request(app)
      .get("/user")
      .auth("any_jwt", { type: "bearer" })
      .send();

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should receive ok for a valid jwt", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user);

    const token = GenerateJwt.execute({ userId: user.id });
    const res: request.Response = await request(app)
      .get("/user")
      .auth(token, { type: "bearer" })
      .send();

    const resBody = {
      email: "teste@teste.com",
      id: user.id,
      name: "User Test",
    };
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(resBody);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
