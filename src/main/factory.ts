import { CreateEventUseCase } from "../app/useCases/CreateEvent/CreateEventUseCase";
import { EventRepositoryMongo } from "../infra/repositories/eventRepository/EventRepositoryMongo";
import { CreateEventController } from "../presentation/controllers/CreateEventController";

const eventRepositoryMongo = new EventRepositoryMongo();
const createEventUseCase = new CreateEventUseCase(eventRepositoryMongo);
const createEventController = new CreateEventController(createEventUseCase);

export { createEventController };