import express from "express";
import cors from "cors";
import { UsersDB } from "../../../src/main/UsersDB";
import { usersRouterMock } from "./routes.mock";

export class AppUsers {
  public express: express.Application;

  constructor() {
    this.express = express();
  }

  public async run(): Promise<AppUsers> {
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
    await UsersDB.connect();
  }

  private routes(): void {
    this.express.use(usersRouterMock);
  }
}
