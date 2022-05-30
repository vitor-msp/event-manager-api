import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { BuildExistingUser } from "../../conversors/BuildExistingUser";
import { GetDataFromUser } from "../../conversors/GetDataFromUser";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { ChangePasswordInputDto } from "./ChangePasswordInputDto";

export class ChangePasswordUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(
    userId: number,
    input: ChangePasswordInputDto
  ): Promise<void> {
    const userEntity = await this.usersRepository.select(userId);

    if (!userEntity) throw new UserNotFoundError();

    const user = BuildExistingUser.execute(userEntity);

    const { currentPassword, newPassword } = input;
    user.changePassword(newPassword, currentPassword);

    // await this.usersRepository.update(GetDataFromUser.execute(user));
  }
}
