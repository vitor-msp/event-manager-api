import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { EditUserInputDto } from "../../../src/app/useCases/EditUser/EditUserInputDto";

describe("Edit User Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
    await dataSource.getRepository(UserEntity).clear();
  });

  it("should receive not found for an inexistent user", async () => {
    const reqBody: EditUserInputDto = {
      name: "User Test Edited",
    };

    const res: request.Response = await request(app)
      .put("/user")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "User Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive ok", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: EditUserInputDto = {
      name: "User Test Edited",
    };
    const res: request.Response = await request(app)
      .put("/user")
      .query({ userId: user.id.toString() })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedUser = await dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: user.id });
    expect(savedUser!.email).toBe("teste@teste.com");
    expect(savedUser!.name).toBe("User Test Edited");
    expect(savedUser!.password).toBe("teste123");
  });

  it("should receive bad request for invalid name", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: EditUserInputDto = {
      name: "123",
    };
    const res: request.Response = await request(app)
      .put("/user")
      .query({ userId: user.id.toString() })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Name",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
    const savedUser = await dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: user.id });
    expect(savedUser!.email).toBe("teste@teste.com");
    expect(savedUser!.name).toBe("User Test");
    expect(savedUser!.password).toBe("teste123");
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
