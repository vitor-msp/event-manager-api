import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { GetUsersOutputDto } from "./GetUsersOutputDto";

export class GetUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(): Promise<GetUsersOutputDto> {
    const users = await this.usersRepository.selectMany();

    return {
      users: users.map(({ id, email }) => {
        return {
          id: id!,
          email,
        };
      }),
    };
  }
}
