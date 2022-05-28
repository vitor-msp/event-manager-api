import { IUser } from "../../../app/interfaces/IUser";

export interface IUsersRepository {
  existsByEmail(email: string): Promise<boolean>;

  insert(event: IUser): Promise<void>;
}
