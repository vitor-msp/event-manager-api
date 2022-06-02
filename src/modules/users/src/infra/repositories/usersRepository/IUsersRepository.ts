import { IUser } from "../../../app/interfaces/IUser";
import { CreateUserOutputDto } from "../../../app/useCases/CreateUser/CreateUserOutputDto";
import { FilterExistingUsersDto } from "../../../app/useCases/FilterExistingUsers/FilterExistingUsersDto";
import { UserEntity } from "../../database/schemas/UserEntity";

export interface IUsersRepository {
  existsByEmail(email: string): Promise<boolean>;

  insert(user: IUser): Promise<CreateUserOutputDto>;

  select(userId: number): Promise<IUser | null>;

  update(user: IUser): Promise<void>;

  selectByEmail(email: string): Promise<IUser | null>;

  selectMany(): Promise<IUser[]>;

  filterExisting(
    usersId: number[]
  ): Promise<UserEntity[]>;
}
