import { DataSource } from "typeorm";
import { AuthUseCase } from "../app/useCases/Auth/AuthUseCase";
import { ChangePasswordUseCase } from "../app/useCases/ChangePassword/ChangePasswordUseCase";
import { CreateUserUseCase } from "../app/useCases/CreateUser/CreateUserUseCase";
import { EditUserUseCase } from "../app/useCases/EditUser/EditUserUseCase";
import { FilterExistingUsersUseCase } from "../app/useCases/FilterExistingUsers/FilterExistingUsersUseCase";
import { GetUserDataUseCase } from "../app/useCases/GetUserData/GetUserDataUseCase";
import { GetUsersUseCase } from "../app/useCases/GetUsers/GetUsersUseCase";
import { dbOptions } from "../infra/database/config/configDB";
import { UsersRepositoryPG } from "../infra/repositories/usersRepository/UsersRepositoryPG";
import { AuthController } from "../presentation/controllers/AuthController";
import { ChangePasswordController } from "../presentation/controllers/ChangePasswordController";
import { CreateUserController } from "../presentation/controllers/CreateUserController";
import { EditUserController } from "../presentation/controllers/EditUserController";
import { GetUserDataController } from "../presentation/controllers/GetUserDataController";
import { GetUsersController } from "../presentation/controllers/GetUsersController";

const dataSource = new DataSource(dbOptions);
const usersRepositoryPG = new UsersRepositoryPG(dataSource);

const createUserUseCase = new CreateUserUseCase(usersRepositoryPG);
const createUserController = new CreateUserController(createUserUseCase);

const getUserDataUseCase = new GetUserDataUseCase(usersRepositoryPG);
const getUserDataController = new GetUserDataController(getUserDataUseCase);

const editUserUseCase = new EditUserUseCase(usersRepositoryPG);
const editUserController = new EditUserController(editUserUseCase);

const changePasswordUseCase = new ChangePasswordUseCase(usersRepositoryPG);
const changePasswordController = new ChangePasswordController(
  changePasswordUseCase
);

const authUseCase = new AuthUseCase(usersRepositoryPG);
const authController = new AuthController(authUseCase);

const getUsersUseCase = new GetUsersUseCase(usersRepositoryPG);
const getUsersController = new GetUsersController(getUsersUseCase);

const filterExistingUsersUseCase = new FilterExistingUsersUseCase(
  usersRepositoryPG
);

export {
  dataSource,
  createUserController,
  getUserDataController,
  editUserController,
  changePasswordController,
  authController,
  getUsersController,
  filterExistingUsersUseCase,
};
