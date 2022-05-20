import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";

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
    const url =
      process.env.MONGO_URI || `mongodb://localhost:27017/event-manager`;

    await mongoose
      .connect(url)
      .then(() => {
        console.log("Connected to MongoDB!");
      })
      .catch((error) => {
        console.log(`Error to connect to MongoDB: ${error}`);
      });
  }

  routes(): void {
    this.express.use(routes);
  }
}
