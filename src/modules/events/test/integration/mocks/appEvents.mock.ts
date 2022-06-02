import express from "express";
import cors from "cors";
import { eventsRouterMock } from "./routes.mock";
import { EventsDB } from "../../../src/main/EventsDB";

export class AppEvents {
  public express: express.Application;

  constructor() {
    this.express = express();
  }

  public async run(): Promise<AppEvents> {
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
  }

  private routes(): void {
    this.express.use(eventsRouterMock);
  }
}
