import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { CreateUserInputDto } from "../../../src/app/useCases/CreateUser/CreateUserInputDto";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { CompareEncryptedData } from "../../../src/domain/helpers/CompareEncryptedData";

describe("Create User Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
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
    const savedUser = await dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: res.body.userId });
    expect(savedUser!.email).toBe("teste@teste.com");
    expect(savedUser!.name).toBe("User Test");
    expect(CompareEncryptedData.execute("teste123", savedUser!.password)).toBe(
      true
    );
    expect(CompareEncryptedData.execute("teste.123", savedUser!.password)).toBe(
      false
    );
  });

  it("should receive bad request when email already in use", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const savedUser = new UserEntity();
    savedUser.email = "teste@teste.com";
    savedUser.name = "Other user";
    savedUser.password = "teste123";
    await dataSource.getRepository(UserEntity).save(savedUser);

    const reqBody: CreateUserInputDto = {
      name: "User Test",
      email: "teste@teste.com",
      password: "teste123",
    };
    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Email In Use",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive bad request for invalid name", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const reqBody: CreateUserInputDto = {
      name: "     ",
      email: "teste@teste.com",
      password: "teste123",
    };
    const res: request.Response = await request(app)
      .post("/user")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Name",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
