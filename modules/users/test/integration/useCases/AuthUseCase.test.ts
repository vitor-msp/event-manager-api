import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { App } from "../../../../../main/app";
import { dataSource } from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { AuthInputDto } from "../../../src/app/useCases/Auth/AuthInputDto";
import { EncryptData } from "../../../src/domain/helpers/EncryptData";

describe("Auth Use Case", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new App().run()).express;
  });

  it("should receive not found for an inexistent user", async () => {
    await dataSource.getRepository(UserEntity).clear();

    const reqBody: AuthInputDto = {
      email: "teste@teste.com",
      password: "teste123",
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

  it("should receive unauthorized for invalid password", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = EncryptData.execute("teste123");
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: AuthInputDto = {
      email: "teste@teste.com",
      password: "Teste123",
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Incorrect Password",
    };
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(errorResponse);
  });

  it("should receive ok with jwt token", async () => {
    await dataSource.getRepository(UserEntity).clear();
    const user = new UserEntity();
    user.email = "teste@teste.com";
    user.name = "User Test";
    user.password = EncryptData.execute("teste123");
    await dataSource.getRepository(UserEntity).save(user);

    const reqBody: AuthInputDto = {
      email: "teste@teste.com",
      password: "teste123",
    };
    const res: request.Response = await request(app)
      .post("/user/auth")
      .send(reqBody);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jwt");
    const jwtDecoded = jwt.verify(res.body.jwt, process.env.JWT_KEY!);
    expect(jwtDecoded).toHaveProperty("userId");
    // @ts-ignore
    expect(jwtDecoded.userId).toBe(user.id);
    expect(jwtDecoded).toHaveProperty("iat");
    expect(jwtDecoded).toHaveProperty("exp");
    // @ts-ignore
    const timeToExpire = jwtDecoded.exp - jwtDecoded.iat;
    const fiveMinutesInSeconds = 60 * 5;
    expect(timeToExpire).toBe(fiveMinutesInSeconds);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
