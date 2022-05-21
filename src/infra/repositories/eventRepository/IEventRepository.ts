import { IEvent } from "../../../app/interfaces/IEvent";
import { CreateEventOutputDto } from "../../../app/useCases/CreateEvent/CreateEventOutputDto";

export interface IEventRepository {
  insert(event: IEvent): Promise<CreateEventOutputDto>;

  select(eventId: number): Promise<IEvent | null>;

  update(event: IEvent): Promise<void>;
}