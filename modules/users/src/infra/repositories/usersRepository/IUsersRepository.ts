import { IUser } from "../../../app/interfaces/IUser";
import { CreateUserOutputDto } from "../../../app/useCases/CreateUser/CreateUserOutputDto";

export interface IUsersRepository {
  existsByEmail(email: string): Promise<boolean>;

  insert(event: IUser): Promise<CreateUserOutputDto>;
}
