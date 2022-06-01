import { FilterExistingUsersUseCase } from "../../../../users/src/app/useCases/FilterExistingUsers/FilterExistingUsersUseCase";
import { FilterExistingUsersDto } from "../../../../users/src/app/useCases/FilterExistingUsers/FilterExistingUsersDto";
import { IUsersService } from "./IUsersService";

export class UsersService implements IUsersService {
  constructor(private readonly usersModule: FilterExistingUsersUseCase) {}

  async filterExistingUsers(usersToFilter: number[]): Promise<number[]> {
    const dto: FilterExistingUsersDto = {
      users: usersToFilter.map((id) => {
        return {
          id,
        };
      }),
    };

    const filteredUsers = await this.usersModule.execute(dto);

    return filteredUsers.users.map((u) => {
      return u.id;
    });
  }
}
