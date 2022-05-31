import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { dataSource } from "../../../src/main/factory";
import { AuthInputDto } from "../../../src/app/useCases/Auth/AuthInputDto";

describe("Auth Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
  });

  it("should return bad request: missing email", async () => {
    const reqBody: AuthInputDto = {
      email: "",
      password: "teste123",
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Email",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: invalid email", async () => {
    const reqBody: AuthInputDto = {
      email: "teste.teste",
      password: "teste123",
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Email",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: missing password", async () => {
    const reqBody: AuthInputDto = {
      email: "teste@teste.com",
      password: "",
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Password",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
