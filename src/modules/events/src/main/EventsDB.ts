import mongoose from "mongoose";

export abstract class EventsDB {
  public static async connect(): Promise<void> {
    const url = process.env.EVENTS_DB_URL!;

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
