import request from "supertest";
import express from "express";
import { App } from "../../../../main/app";
import { CreateUserInputDto } from "../../../src/app/useCases/CreateUserInputDto";
import { ErrorResponse } from "../../../../helpers/responses/httpResponses";
import mongoose from "mongoose";

describe("Create User Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = new App().express;
  });

  it("should return bad request: missing user name", async () => {
    // @ts-ignore
    const reqBody: CreateUserInputDto = {
      email: "teste@teste.com",
      password: "teste123",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing User Name",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: invalid user name", async () => {
    const reqBody: CreateUserInputDto = {
      // @ts-ignore
      name: 100,
      email: "teste@teste.com",
      password: "teste123",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Name",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: missing user email", async () => {
    // @ts-ignore
    const reqBody: CreateUserInputDto = {
      name: "User Test",
      password: "teste123",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing User Email",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: invalid user email", async () => {
    const reqBody: CreateUserInputDto = {
      name: "User Test",
      email: "teste.teste.com",
      password: "teste123",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid User Email",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    mongoose.disconnect();
    app = null;
  });
});
