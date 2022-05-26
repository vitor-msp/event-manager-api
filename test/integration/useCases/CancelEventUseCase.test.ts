import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { App } from "../../../src/main/app";
import {
  EventModel,
} from "../../../src/infra/database/schemas/EventSchema";
import { ErrorResponse } from "../../../src/presentation/responses/httpResponses";
import { IEvent } from "../../../src/app/interfaces/IEvent";

let app: express.Application | null;
beforeAll(async () => {
  app = new App().express;
});

const saveEvent = async () => {
  await EventModel.deleteMany();
  const startEvent = new Date();
  const event: IEvent = {
    id: 1,
    creator: 1,
    title: "Event Test",
    start: startEvent,
    duration: 60 * 60,
    guests: [
      { user: 2, permission: "Editor" },
      { user: 3, permission: "Viewer" },
    ],
  };
  await EventModel.create(event);
};

describe("Cancel Event Use Case", () => {
  it("should receive not found for an inexisting event", async () => {
    await EventModel.deleteMany();
    const reqBody = {
      eventId: 1,
    };

    const res: request.Response = await request(app)
      .delete("/event")
      .query({ userId: "1" })
      .send(reqBody);

    const errorResponse: ErrorResponse = {
      message: "Event Not Found",
    };
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(errorResponse);
  });

  // it("should receive unauthorized when a not guest try edit an event", async () => {
  //   await saveEvent();
  //   const reqBody = {
  //     id: 1,
  //     title: "Event Edited",
  //   };

  //   const res: request.Response = await request(app)
  //     .delete("/event")
  //     .query({ userId: "4" })
  //     .send(reqBody);

  //   const errorResponse: ErrorResponse = {
  //     message: "Permission Denied!",
  //   };
  //   expect(res.statusCode).toBe(401);
  //   expect(res.body).toEqual(errorResponse);
  // });

  // it("should receive ok when editor edit an event", async () => {
  //   await saveEvent();
  //   const newEventStart = new Date();
  //   const reqBody = {
  //     id: 1,
  //     title: "Event Test Edited",
  //     start: newEventStart,
  //     duration: 0,
  //     guests: [
  //       { user: 2, permission: "Viewer" },
  //       { user: 4, permission: "Editor" },
  //     ],
  //     guestsToRemove: [3],
  //   };

  //   const res: request.Response = await request(app)
  //     .delete("/event")
  //     .query({ userId: "2" })
  //     .send(reqBody);

  //   expect(res.statusCode).toBe(200);
  //   const savedEvent: IEvent | null = await EventModel.findOne({ id: 1 });
  //   const { id, creator, title, start, duration, guests } = savedEvent!;
  //   expect(id).toBe(1);
  //   expect(creator).toBe(1);
  //   expect(title).toBe("Event Test Edited");
  //   expect(start.toISOString()).toBe(newEventStart.toISOString());
  //   expect(duration).toBe(0);
  //   expect(guests.toString()).toEqual(
  //     "{ user: 2, permission: 'Viewer' },{ user: 4, permission: 'Editor' }"
  //   );
  // });

});

afterAll(async () => {
  await EventModel.deleteMany();
  mongoose.disconnect();
  app = null;
});
