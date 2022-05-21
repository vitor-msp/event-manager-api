import { CreateEventUseCase } from "../app/useCases/CreateEvent/CreateEventUseCase";
import { EditEventUseCase } from "../app/useCases/EditEvent/EditEventUseCase";
import { EventRepositoryMongo } from "../infra/repositories/eventRepository/EventRepositoryMongo";
import { CreateEventController } from "../presentation/controllers/CreateEventController";
import { EditEventController } from "../presentation/controllers/EditEventController";

const eventRepositoryMongo = new EventRepositoryMongo();

const createEventUseCase = new CreateEventUseCase(eventRepositoryMongo);
const createEventController = new CreateEventController(createEventUseCase);

const editEventUseCase = new EditEventUseCase(eventRepositoryMongo);
const editEventController = new EditEventController(editEventUseCase);

export { createEventController, editEventController };