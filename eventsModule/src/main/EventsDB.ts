import mongoose from "mongoose";

export abstract class EventsDB {
  public static async connect(): Promise<void> {
    const url =
      process.env.MONGO_URI || `mongodb://localhost:27017/event-manager`;

    await mongoose
      .connect(url)
      .then(() => {
        console.log("Connected to Events MongoDB!");
      })
      .catch((error) => {
        console.log(`Error to connect to Events MongoDB: ${error}`);
      });
  }
}
