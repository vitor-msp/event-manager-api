import { IEvent } from "../../../app/interfaces/IEvent";
import { CreateEventOutputDto } from "../../../app/useCases/CreateEvent/CreateEventOutputDto";
import { EventModel, IEventModel } from "../../database/schemas/EventSchema";
import { SelectByPeriodDto, IEventRepository } from "./IEventRepository";

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

  async selectByPeriod(dto: SelectByPeriodDto): Promise<IEvent[]> {
    const { userId, month, year } = dto;
    const projection: IEvent = {
      //@ts-ignore
      _id: 0,
      id: 1,
      creator: 1,
      //@ts-ignore
      title: 1,
      //@ts-ignore
      start: 1,
      duration: 1,
      //@ts-ignore
      guests: 1,
    };
    return await EventModel.find(
      {
        start: {
          $gte: new Date(year, month, 1, 0, 0, 0),
          $lte: new Date(year, month + 1, 0, 23, 59, 59),
        },
        $or: [{ creator: userId }, { "guests.user": userId }],
      },
      projection
    );
  }
}
