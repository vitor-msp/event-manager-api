import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { CreateUserInputDto } from "../../../src/app/useCases/CreateUserInputDto";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";

describe("Create User Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
    await dataSource.getRepository(UserEntity).clear();
  });

  it("should receive created for a valid user", async () => {
    const reqBody: CreateUserInputDto = {
      name: "User Test",
      email: "teste@teste.com",
      password: "teste123",
    };

    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
