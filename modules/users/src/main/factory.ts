import { DataSource } from "typeorm";
import { CreateUserUseCase } from "../app/useCases/CreateUser/CreateUserUseCase";
import { dbOptions } from "../infra/database/config/configDB";
import { UsersRepositoryPG } from "../infra/repositories/usersRepository/UsersRepositoryPG";
import { CreateUserController } from "../presentation/controllers/CreateUserController";
import { GetUserDataController } from "../presentation/controllers/GetUserDataController";

const dataSource = new DataSource(dbOptions)
const usersRepositoryPG = new UsersRepositoryPG(dataSource);

const createUserUseCase = new CreateUserUseCase(usersRepositoryPG);
const createUserController = new CreateUserController(createUserUseCase);

const getUserDataController = new GetUserDataController();

export { dataSource, createUserController, getUserDataController };