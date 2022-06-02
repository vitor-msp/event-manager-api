import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { FilterExistingUsersDto } from "./FilterExistingUsersDto";

export class FilterExistingUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(
    anyUsers: FilterExistingUsersDto
  ): Promise<FilterExistingUsersDto> {
    if (anyUsers.users.length === 0) return { users: [] };

    const usersId: number[] = anyUsers.users.map(({ id }) => id);

    const existingUsers = await this.usersRepository.filterExisting(usersId);

    return {
      users: existingUsers.map(({ id }) => {
        return { id };
      }),
    };
  }
}
