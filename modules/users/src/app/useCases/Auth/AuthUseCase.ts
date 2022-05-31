import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { BuildExistingUser } from "../../conversors/BuildExistingUser";
import { IncorrectPasswordError } from "../../errors/IncorrectPasswordError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { GenerateJwt } from "../../helpers/GenerateJwt";
import { AuthInputDto } from "./AuthInputDto";
import { AuthOutputDto } from "./AuthOutputDto";

export class AuthUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(input: AuthInputDto): Promise<AuthOutputDto> {
    const { email, password } = input;
    const userEntity = await this.usersRepository.selectByEmail(email);

    if (!userEntity) throw new UserNotFoundError();

    const user = BuildExistingUser.execute(userEntity);

    const passwordIsCorrect = user.passwordIsCorrect(password);

    if (!passwordIsCorrect) throw new IncorrectPasswordError();

    const jwtPayload = GenerateJwt.execute({ userId: user.getData().id });

    return {
      jwt: jwtPayload,
    };
  }
}
