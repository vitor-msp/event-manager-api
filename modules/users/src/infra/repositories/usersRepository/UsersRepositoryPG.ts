import { DataSource, Repository } from "typeorm";
import { IUser } from "../../../app/interfaces/IUser";
import { CreateUserOutputDto } from "../../../app/useCases/CreateUser/CreateUserOutputDto";
import { UserEntity } from "../../database/schemas/UserEntity";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepositoryPG implements IUsersRepository {
  private readonly usersRepository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.usersRepository = dataSource.getRepository(UserEntity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const emails = await this.usersRepository.find({ where: { email } });
    return emails.length !== 0;
  }

  async insert(user: IUser): Promise<CreateUserOutputDto> {
    const { email, name, password } = user;

    const userEntity = new UserEntity();
    userEntity.email = email;
    userEntity.name = name;
    userEntity.password = password;

    await this.usersRepository.save(userEntity);

    return { userId: userEntity.id };
  }
}