import { Repository } from "typeorm";
import { AppDataSource } from "../../database/config/configDB";
import { UserEntity } from "../../database/schemas/UserEntity";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepositoryPG implements IUsersRepository {
  private readonly usersRepository: Repository<UserEntity>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(UserEntity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return false;
  }

  async insert(user: UserEntity): Promise<void> {
    await this.usersRepository.save(user);
  }
}
