import { DataSource } from "typeorm";
import { CreateUserUseCase } from "../app/useCases/CreateUser/CreateUserUseCase";
import { EditUserUseCase } from "../app/useCases/EditUser/EditUserUseCase";
import { GetUserDataUseCase } from "../app/useCases/GetUserData/GetUserDataUseCase";
import { dbOptions } from "../infra/database/config/configDB";
import { UsersRepositoryPG } from "../infra/repositories/usersRepository/UsersRepositoryPG";
import { CreateUserController } from "../presentation/controllers/CreateUserController";
import { EditUserController } from "../presentation/controllers/EditUserController";
import { GetUserDataController } from "../presentation/controllers/GetUserDataController";

const dataSource = new DataSource(dbOptions)
const usersRepositoryPG = new UsersRepositoryPG(dataSource);

const createUserUseCase = new CreateUserUseCase(usersRepositoryPG);
const createUserController = new CreateUserController(createUserUseCase);

const getUserDataUseCase = new GetUserDataUseCase(usersRepositoryPG)
const getUserDataController = new GetUserDataController(getUserDataUseCase);

const editUserUseCase = new EditUserUseCase(usersRepositoryPG);
const editUserController = new EditUserController(editUserUseCase);

export {
  dataSource,
  createUserController,
  getUserDataController,
  editUserController,
};
