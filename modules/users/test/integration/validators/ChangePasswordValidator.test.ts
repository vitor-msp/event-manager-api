import request from "supertest";
import express from "express";
import { AppUsers } from "../mocks/appUsers.mock";
import { ErrorResponse } from "../../../../../helpers/responses/httpResponses";
import { dataSource } from "../../../src/main/factory";
import { ChangePasswordInputDto } from "../../../src/app/useCases/ChangePassword/ChangePasswordInputDto";

describe("Change Password Validator", () => {
  let app: express.Application | null;
  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
  });

  it("should return bad request: missing user id", async () => {
    const res: request.Response = await request(app).put("/user/password").send();

    const errorResponse: ErrorResponse = {
      message: "Missing User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: invalid user id", async () => {
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: "a" })
      .send();

    const errorResponse: ErrorResponse = {
      message: "Invalid User Id",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: missing current password", async () => {
    const reqBody: ChangePasswordInputDto = {
      currentPassword: "",
      newPassword: "teste.123",
    };
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing Current Password",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  it("should return bad request: missing new password", async () => {
    const reqBody: ChangePasswordInputDto = {
      currentPassword: "teste123",
      newPassword: "",
    };
    const res: request.Response = await request(app)
      .put("/user/password")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Missing New Password",
    };
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(errorResponse);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
