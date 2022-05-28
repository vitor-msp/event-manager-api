import express from "express";
import cors from "cors";
import { EventsDB } from "../modules/events/src/main/EventsDB";
import { eventsRouter } from "../modules/events/src/main/routes";
import { usersRouter } from "../modules/users/src/main/routes";
import { UsersDB } from "../modules/users/src/main/UsersDB";

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
    // await EventsDB.connect();
    await UsersDB.connect();
  }

  routes(): void {
    // this.express.use(eventsRouter);
    this.express.use(usersRouter);
  }
}
