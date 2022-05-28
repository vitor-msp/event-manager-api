import express from "express";
import cors from "cors";
import { EventsDB } from "../eventsModule/src/main/EventsDB";
import { eventsRouter } from "../eventsModule/src/main/routes";
import { usersRouter } from "../usersModule/src/main/routes";

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
  }

  async database(): Promise<void> {
    await EventsDB.connect();
  }

  routes(): void {
    this.express.use(eventsRouter);
    this.express.use(usersRouter);
  }
}
