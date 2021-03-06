import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { CreateUserInputDto } from "../../../src/app/useCases/CreateUser/CreateUserInputDto";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { dataSource } from "../../../src/main/factory";

describe("Create User Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
  });

  it("should return bad request: missing user name", async () => {
    // @ts-ignore
    const reqBody: CreateUserInputDto = {
      email: "  teste@teste.com  ",
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

  it("should return bad request: missing user email", async () => {
    // @ts-ignore
    const reqBody: CreateUserInputDto = {
      name: "  User Test  ",
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
      name: "  User Test  ",
      email: "  teste.teste.com  ",
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

  it("should return bad request: missing user password", async () => {
    // @ts-ignore
    const reqBody: CreateUserInputDto = {
      name: "  User Test  ",
      email: "  teste@teste.com  ",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing User Password",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: user password is blank", async () => {
    const reqBody: CreateUserInputDto = {
      name: "  User Test  ",
      email: "  teste@teste.com  ",
      password: "         ",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Password Is Blank",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
