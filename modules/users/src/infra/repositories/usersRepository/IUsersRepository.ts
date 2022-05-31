import { IUser } from "../../../app/interfaces/IUser";
import { CreateUserOutputDto } from "../../../app/useCases/CreateUser/CreateUserOutputDto";
import { GetUserDataOutputDto } from "../../../app/useCases/GetUserData/GetUserDataOutputDto";

export interface IUsersRepository {
  existsByEmail(email: string): Promise<boolean>;

  insert(user: IUser): Promise<CreateUserOutputDto>;

  select(userId: number): Promise<IUser | null>;

  update(user: IUser): Promise<void>;

  selectByEmail(email: string): Promise<IUser | null>;
}
