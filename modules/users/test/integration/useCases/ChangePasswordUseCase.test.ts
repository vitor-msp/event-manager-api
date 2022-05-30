import request from "supertest";
import express from "express";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { ChangePasswordInputDto } from "../../../src/app/useCases/ChangePassword/ChangePasswordInputDto";
import { EncryptData } from "../../../src/domain/helpers/EncryptData";
import { CompareEncryptedData } from "../../../src/domain/helpers/CompareEncryptedData";

describe("Change Password Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
  });

  it("should receive not found for an inexistent user", async () => {
    await dataSource.getRepository(UserEntity).clear();

    const reqBody: ChangePasswordInputDto = {
      currentPassword: "teste123",
      newPassword: "teste.123",
    };
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "User Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive unauthorized for invalid password", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: ChangePasswordInputDto = {
      currentPassword: "teste.123",
      newPassword: "teste.123",
    };
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: user.id })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Invalid Password",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
    const savedUser = await dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: user.id });
    expect(savedUser!.email).toBe("teste@teste.com");
    expect(savedUser!.name).toBe("User Test");
    expect(savedUser!.password).toBe("teste123");
  });

  it("should receive ok", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = EncryptData.execute("teste123");
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: ChangePasswordInputDto = {
      currentPassword: "teste123",
      newPassword: "teste.123",
    };
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: user.id })
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    const savedUser = await dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: user.id });
    expect(savedUser!.email).toBe("teste@teste.com");
    expect(savedUser!.name).toBe("User Test");
    expect(CompareEncryptedData.execute("teste.123", savedUser!.password)).toBe(
      true
    );
    expect(CompareEncryptedData.execute("teste123", savedUser!.password)).toBe(
      false
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
