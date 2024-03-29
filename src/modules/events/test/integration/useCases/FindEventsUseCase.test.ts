import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { AppEvents } from "../mocks/appEvents.mock";
import { EventModel } from "../../../src/infra/database/schemas/EventSchema";
import { FindEventsOutputDto } from "../../../src/app/useCases/FindEvents/FindEventsOutputDto";

let app: express.Application | null;
beforeAll(async () => {
  app = (await new AppEvents().run()).express;
  await EventModel.deleteMany();
  await saveEvents();
});

const saveEvents = async () => {
  await EventModel.create({
    id: 1,
    creator: 1,
    title: "Event 1",
    start: new Date(2022, 3, 30, 23, 59, 59),
  });

  await EventModel.create({
    id: 5,
    creator: 2,
    title: "Event 5",
    start: new Date(2022, 4, 31, 23, 59, 59),
    guests: [
      { user: 1, permission: "Editor" },
      { user: 3, permission: "Viewer" },
    ],
  });

  await EventModel.create({
    id: 3,
    creator: 1,
    title: "Event 3",
    start: new Date(2022, 4, 1, 0, 0, 1),
  });

  await EventModel.create({
    id: 2,
    creator: 1,
    title: "Event 2",
    start: new Date(2022, 4, 1, 0, 0, 0),
  });

  await EventModel.create({
    id: 4,
    creator: 2,
    title: "Event 4",
    start: new Date(2022, 4, 5, 23, 59, 59),
    guests: [
      { user: 3, permission: "Viewer" },
      { user: 4, permission: "Editor" },
    ],
  });

  await EventModel.create({
    id: 6,
    creator: 2,
    title: "Event 6",
    start: new Date(2022, 5, 1, 0, 0, 0),
    guests: [
      { user: 3, permission: "Editor" },
      { user: 1, permission: "Viewer" },
    ],
  });

  await EventModel.create({
    id: 7,
    creator: 2,
    title: "Event 7",
    start: new Date(2022, 5, 1, 0, 0, 1),
    guests: [
      { user: 3, permission: "Viewer" },
      { user: 1, permission: "Editor" },
    ],
  });
};

describe("Find Events Use Case", () => {
  it("should receive ok with saved events", async () => {
    const reqQuery = {
      userId: "1",
      month: 4,
      year: 2022,
    };

    const res: request.Response = await request(app)
      .get("/event")
      .query(reqQuery)
      .send();

    const resBody: FindEventsOutputDto = {
      year: 2022,
      month: 4,
      days: [
        {
          day: 1,
          events: [
            {
              creator: 1,
              duration: 0,
              guests: [],
              id: 2,
              //@ts-ignore
              start: new Date(2022, 4, 1, 0, 0, 0).toISOString(),
              title: "Event 2",
            },
            {
              creator: 1,
              duration: 0,
              guests: [],
              id: 3,
              //@ts-ignore
              start: new Date(2022, 4, 1, 0, 0, 1).toISOString(),
              title: "Event 3",
            },
          ],
        },
        {
          day: 31,
          events: [
            {
              creator: 2,
              duration: 0,
              guests: [
                { user: 1, permission: "Editor" },
                { user: 3, permission: "Viewer" },
              ],
              id: 5,
              //@ts-ignore
              start: new Date(2022, 4, 31, 23, 59, 59).toISOString(),
              title: "Event 5",
            },
          ],
        },
      ],
    };
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(resBody);
  });
});

afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  app = null;
});
