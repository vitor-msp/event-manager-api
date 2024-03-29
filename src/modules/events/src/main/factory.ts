import { filterExistingUsersUseCase } from "../../../users/src/main/factory";
import { CancelEventUseCase } from "../app/useCases/CancelEvent/CancelEventUseCase";
import { CreateEventUseCase } from "../app/useCases/CreateEvent/CreateEventUseCase";
import { EditEventUseCase } from "../app/useCases/EditEvent/EditEventUseCase";
import { ExitOfTheEventUseCase } from "../app/useCases/ExitOfTheEvent/ExitOfTheEventUseCase";
import { FindEventsUseCase } from "../app/useCases/FindEvents/FindEventsUseCase";
import { PrepareOutputEvents } from "../app/utils/PrepareOutputEvents";
import { EventRepositoryMongo } from "../infra/repositories/eventRepository/EventRepositoryMongo";
import { UsersService } from "../infra/usersService/UsersService";
import { CancelEventController } from "../presentation/controllers/CancelEventController";
import { CreateEventController } from "../presentation/controllers/CreateEventController";
import { EditEventController } from "../presentation/controllers/EditEventController";
import { ExitOfTheEventController } from "../presentation/controllers/ExitOfTheEventController";
import { FindEventsController } from "../presentation/controllers/FindEventsController";

const eventRepositoryMongo = new EventRepositoryMongo();
const usersService = new UsersService(filterExistingUsersUseCase);

const createEventUseCase = new CreateEventUseCase(
  eventRepositoryMongo,
  usersService
);
const createEventController = new CreateEventController(createEventUseCase);

const editEventUseCase = new EditEventUseCase(
  eventRepositoryMongo,
  usersService
);
const editEventController = new EditEventController(editEventUseCase);

const cancelEventUseCase = new CancelEventUseCase(eventRepositoryMongo);
const cancelEventController = new CancelEventController(cancelEventUseCase);

const exitOfTheEventUseCase = new ExitOfTheEventUseCase(eventRepositoryMongo);
const exitOfTheEventController = new ExitOfTheEventController(
  exitOfTheEventUseCase
);

const prepareOutputEvents = new PrepareOutputEvents();
const findEventsUseCase = new FindEventsUseCase(
  eventRepositoryMongo,
  prepareOutputEvents
);
const findEventsController = new FindEventsController(findEventsUseCase);

export {
  createEventController,
  editEventController,
  cancelEventController,
  exitOfTheEventController,
  findEventsController,
};
