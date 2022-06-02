import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import { App } from "../../src/main/app";
import { UserEntity } from "../../src/modules/users/src/infra/database/schemas/UserEntity";
import { dataSource } from "../../src/modules/users/src/main/factory";
import { EventModel } from "../../src/modules/events/src/infra/database/schemas/EventSchema";

describe("Global Test", () => {
  let app: express.Application | null;

  beforeAll(async () => {
    app = (await new App().run()).express;
    await EventModel.deleteMany();
    await dataSource.getRepository(UserEntity).clear();
  });

  // variables
  let res: request.Response;
  let user1Id: number;
  let user2Id: number;
  let jwt: string;
  let eventStart: string;
  let eventId: number;

  it("should user create account", async () => {
    // create user 1
    res = await request(app).post("/user").send({
      name: "User Creator",
      email: "user1@teste.com",
      password: "user1",
    });
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
    user1Id = res.body.userId;

    // create user 2
    res = await request(app).post("/user").send({
      name: "User Editor",
      email: "user2@teste.com",
      password: "user2",
    });
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
    user2Id = res.body.userId;
  });

  it("should user login", async () => {
    // auth user 1
    res = await request(app).post("/user/auth").send({
      email: "user1@teste.com",
      password: "user1",
    });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jwt");
    jwt = res.body.jwt;
  });

  it("should user create an event", async () => {
    // user 1 create an event
    eventStart = new Date().toISOString();
    res = await request(app)
      .post("/event")
      .auth(jwt, { type: "bearer" })
      .send({
        title: "Event Test",
        start: eventStart,
        duration: 60 * 60,
        guests: [
          { user: user2Id, permission: "Editor" },
          { user: 1, permission: "Viewer" },
        ],
      });
    console.log(res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("eventId");
    eventId = res.body.eventId;
  });

  it("should user view your events", async () => {
    // user 1 get your events
    res = await request(app).get("/event").auth(jwt, { type: "bearer" }).send();
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        creator: user1Id,
        duration: 60 * 60,
        guests: [{ user: user2Id, permission: "Editor" }],
        id: eventId,
        start: eventStart,
        title: "Event Test",
      },
    ]);
  });

  afterAll(async () => {
    await EventModel.deleteMany();
    mongoose.disconnect();
    await dataSource.getRepository(UserEntity).clear();
    await dataSource.destroy();
    app = null;
  });
});
