import { IEvent } from "../../../app/interfaces/IEvent";
import { CreateEventOutputDto } from "../../../app/useCases/CreateEvent/CreateEventOutputDto";
import { EventModel } from "../../database/schemas/EventSchema";
import { IEventRepository } from "./IEventRepository";

export class EventRepositoryMongo implements IEventRepository {
  async insert(event: IEvent): Promise<CreateEventOutputDto> {
    const { id } = await EventModel.create(event);
    return {
      eventId: id,
    };
  }

  async select(eventId: number): Promise<IEvent | null> {
    return await EventModel.findOne({ id: eventId });
  }

  async update(event: IEvent): Promise<void> {
    await EventModel.findOneAndUpdate({ id: event.id }, event);
  }

  async delete(eventId: number): Promise<void> {
    await EventModel.findOneAndDelete({ id: eventId });
  }
}
