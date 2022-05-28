import { User } from "../../domain/entities/User";
import { IUsersRepository } from "../../infra/repositories/usersRepository/IUsersRepository";
import { GetDataFromUser } from "../conversors/GetDataFromUser";
import { EmailInUseError } from "../errors/EmailInUseError";
import { CreateUserInputDto } from "./CreateUserInputDto";

export class CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(userDto: CreateUserInputDto): Promise<void> {
    if (await this.usersRepository.existsByEmail(userDto.email))
      throw new EmailInUseError();

    const user = new User(userDto);

    await this.usersRepository.insert(GetDataFromUser.execute(user));
  }
}
