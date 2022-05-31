import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AuthInputDto } from "./AuthInputDto";

export class AuthUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(input: AuthInputDto): Promise<void> {
    const { email, password } = input;
    const userEntity = await this.usersRepository.selectByEmail(email);

    if (!userEntity) throw new UserNotFoundError();

    // const user = BuildExistingUser.execute(userEntity);

    // const { currentPassword, newPassword } = input;
    // user.changePassword(newPassword, currentPassword);

    // await this.usersRepository.update(GetDataFromUser.execute(user));
  }
}
