import { User } from "../../domain/entities/User";
import { IUsersRepository } from "../../infra/repositories/usersRepository/IUsersRepository";
import { GetDataFromUser } from "../conversors/GetDataFromUser";
import { EmailInUseError } from "../errors/EmailInUseError";
import { CreateUserInputDto } from "./CreateUserInputDto";
import { CreateUserOutputDto } from "./CreateUserOutputDto";

export class CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(userDto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    if (await this.usersRepository.existsByEmail(userDto.email))
      throw new EmailInUseError();

    const user = new User(userDto);

    return await this.usersRepository.insert(GetDataFromUser.execute(user));
  }
}
