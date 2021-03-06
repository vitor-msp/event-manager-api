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

  async select(userId: number): Promise<IUser | null> {
    return await this.usersRepository.findOneBy({ id: userId });
  }

  async update(user: IUser): Promise<void> {
    const { id, email, name, password } = user;

    const userEntity = new UserEntity();
    userEntity.id = id!;
    userEntity.email = email;
    userEntity.name = name;
    userEntity.password = password;

    await this.usersRepository.save(userEntity);
  }

  async selectByEmail(email: string): Promise<IUser | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async selectMany(): Promise<IUser[]> {
    return await this.usersRepository.find();
  }

  async filterExisting(usersId: number[]): Promise<UserEntity[]> {
    return await this.usersRepository
      .createQueryBuilder("user")
      .select("user.id")
      .where("user.id IN (:...ids)", { ids: usersId })
      .getMany();
  }
}
