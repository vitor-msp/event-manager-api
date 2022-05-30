import { DataSource, Repository } from "typeorm";
import { IUser } from "../../../app/interfaces/IUser";
import { UserEntity } from "../../database/schemas/UserEntity";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepositoryPG implements IUsersRepository {
  private readonly usersRepository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.usersRepository = dataSource.getRepository(UserEntity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return false;
  }

  async insert(user: IUser): Promise<void> {
    const { email, name, password } = user;
    
    const userEntity = new UserEntity();
    userEntity.email = email;
    userEntity.name = name;
    userEntity.password = password;

    await this.usersRepository.save(userEntity);
  }
}
