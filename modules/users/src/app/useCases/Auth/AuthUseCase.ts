import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { BuildExistingUser } from "../../conversors/BuildExistingUser";
import { IncorrectPasswordError } from "../../errors/IncorrectPasswordError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { AuthInputDto } from "./AuthInputDto";

export class AuthUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(input: AuthInputDto): Promise<void> {
    const { email, password } = input;
    const userEntity = await this.usersRepository.selectByEmail(email);

    if (!userEntity) throw new UserNotFoundError();

    const user = BuildExistingUser.execute(userEntity);

    const passwordIsCorrect = user.passwordIsCorrect(password);

    if (!passwordIsCorrect) throw new IncorrectPasswordError();

    // await this.usersRepository.update(GetDataFromUser.execute(user));
  }
}
