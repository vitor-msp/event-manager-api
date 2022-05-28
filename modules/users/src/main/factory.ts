import { CreateUserUseCase } from "../app/useCases/CreateUserUseCase";
import { UsersRepositoryPG } from "../infra/repositories/usersRepository/UsersRepositoryPG";
import { CreateUserController } from "../presentation/controllers/CreateUserController";

const usersRepositoryPG = new UsersRepositoryPG();

const createUserUseCase = new CreateUserUseCase(usersRepositoryPG);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
