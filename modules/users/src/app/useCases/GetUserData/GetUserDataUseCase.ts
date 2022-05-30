import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { GetUserDataOutputDto } from "./GetUserDataOutputDto";

export class GetUserDataUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(userId: number): Promise<GetUserDataOutputDto> {
    const user = await this.usersRepository.select(userId)
    
    if (!user)
      throw new UserNotFoundError();

    return user;
  }
}
