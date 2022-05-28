import { IUsersService } from "./IUsersService";

export class UsersService implements IUsersService {
  constructor(){}

  async filterExistingUsers(usersToFilter: number[]): Promise<number[]> {
    return usersToFilter;
  }
}