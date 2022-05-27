import { EventModel } from "../schemas/EventSchema";

export abstract class NextId {
  static async get(): Promise<number> {
    return (await EventModel.count()) + 1;
  }
}
