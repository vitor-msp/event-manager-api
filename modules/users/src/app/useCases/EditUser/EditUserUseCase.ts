import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { UserNotFoundError } from "../../errors/UserNotFoundError";

export class EditUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(userId: number): Promise<void> {
    const user = await this.usersRepository.select(userId);

    if (!user) throw new UserNotFoundError();
  }
}
