import { CreateUserUseCase } from "../app/useCases/CreateUserUseCase";
import { UsersRepository } from "../infra/repositories/usersRepository/UsersRepository";
import { CreateUserController } from "../presentation/controllers/CreateUserController";

const usersRepository = new UsersRepository();

const createUserUseCase = new CreateUserUseCase(usersRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
