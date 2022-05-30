import { IUsersRepository } from "../../../infra/repositories/usersRepository/IUsersRepository";
import { BuildExistingUser } from "../../conversors/BuildExistingUser";
import { GetDataFromUser } from "../../conversors/GetDataFromUser";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { EditUserInputDto } from "./EditUserInputDto";

export class EditUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  public async execute(userId: number, input: EditUserInputDto): Promise<void> {
    const userEntity = await this.usersRepository.select(userId);

    if (!userEntity) throw new UserNotFoundError();

    const user = BuildExistingUser.execute(userEntity);

    user.setName(input.name);

    await this.usersRepository.update(GetDataFromUser.execute(user));
  }
}
