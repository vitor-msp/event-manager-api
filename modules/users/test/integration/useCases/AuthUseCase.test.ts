import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { AuthInputDto } from "../../../src/app/useCases/Auth/AuthInputDto";

describe("Auth Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
  });

  it("should receive not found for an inexistent user", async () => {
    await dataSource.getRepository(UserEntity).clear();

    const reqBody: AuthInputDto = {
      email: "teste@teste.com",
      password: "teste123"
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "User Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
