import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { EventsDB } from "../modules/events/src/main/EventsDB";
import { eventsRouter } from "../modules/events/src/main/routes";
import { usersRouter } from "../modules/users/src/main/routes";
import { UsersDB } from "../modules/users/src/main/UsersDB";

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
  }

  public async run(): Promise<App> {
    dotenv.config();
    this.middlewares();
    await this.database();
    this.routes();
    return this;
  }

  private middlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private async database(): Promise<void> {
    await EventsDB.connect();
    await UsersDB.connect();
  }

  private routes(): void {
    this.express.use(eventsRouter);
    this.express.use(usersRouter);
  }
}
