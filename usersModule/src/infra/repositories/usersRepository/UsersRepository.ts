import { IUser } from "../../../app/interfaces/IUser";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  async existsByEmail(email: string): Promise<boolean> {
    return true;
  };

  async insert(event: IUser): Promise<void>{};
}
