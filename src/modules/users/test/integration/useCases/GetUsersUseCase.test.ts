import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { GetUsersOutputDto } from "../../../src/app/useCases/GetUsers/GetUsersOutputDto";

describe("Get Users Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
    await dataSource.getRepository(UserEntity).clear();
    await insertUsersInDB();
  });
  const user1 = new UserEntity();
  const user2 = new UserEntity();

  const insertUsersInDB = async () => {
    user1.email = "teste@teste.com";
    user1.name = "User 1";
    user1.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user1);

    user2.email = "teste2@teste.com";
    user2.name = "User 2";
    user2.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user2);
  };

  it("should receive ok with users", async () => {
    const res: request.Response = await request(app).get("/users").send();

    const resBody: GetUsersOutputDto = {
      users: [
        {
          id: user1.id,
          email: "teste@teste.com",
        },
        {
          id: user2.id,
          email: "teste2@teste.com",
        },
      ],
    };
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(resBody);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
