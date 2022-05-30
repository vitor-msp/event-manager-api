import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";

describe("Create User Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
    await dataSource.getRepository(UserEntity).clear();
  });

  it("should receive ok with user data", async () => {
    const user = new UserEntity()
    user.email = "teste@teste.com"
    user.name = "User Test"
    user.password = "teste123"
    await dataSource.getRepository(UserEntity).save(user);

    const res: request.Response = await request(app)
      .get("/user")
      .query({userId: user.id.toString()})
      .send();

    const resBody = {
      email: "teste@teste.com",
      id: user.id,
      name: "User Test"
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(resBody);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
