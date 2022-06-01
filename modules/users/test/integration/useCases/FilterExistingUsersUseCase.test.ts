import express from "express";
import {
  dataSource,
  filterExistingUsersUseCase,
} from "../../../src/main/factory";
import { UserEntity } from "../../../src/infra/database/schemas/UserEntity";
import { FilterExistingUsersUseCase } from "../../../src/app/useCases/FilterExistingUsers/FilterExistingUsersUseCase";
import { AppUsers } from "../mocks/appUsers.mock";
import { FilterExistingUsersDto } from "../../../src/app/useCases/FilterExistingUsers/FilterExistingUsersDto";

describe("Filter Existing Users Use Case", () => {
  let useCase: FilterExistingUsersUseCase | null;
  let app: express.Application | null;

  beforeAll(async () => {
    app = (await new AppUsers().run()).express;
    useCase = filterExistingUsersUseCase;
    await dataSource.getRepository(UserEntity).clear();
    await insertUsersInDB();
  });

  const user1 = new UserEntity();
  const user2 = new UserEntity();

  const insertUsersInDB = async () => {
    user1.email = "teste@teste.com";
    user1.name = "User 1";
    user1.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user1);

    user2.email = "teste2@teste.com";
    user2.name = "User 2";
    user2.password = "teste123";
    await dataSource.getRepository(UserEntity).save(user2);
  };

  it("should filter existing users in a list of users", async () => {
    const anyUsers: FilterExistingUsersDto = {
      users: [{ id: 1 }, { id: user1.id }, { id: 2 }, { id: user2.id }],
    };

    const res = await useCase!.execute(anyUsers);

    const existingUsers: FilterExistingUsersDto = {
      users: [{ id: user1.id }, { id: user2.id }],
    };
    expect(res).toEqual(existingUsers);
  });

  it("should filter existing users in a list with duplicated users", async () => {
    const anyUsers: FilterExistingUsersDto = {
      users: [
        { id: 1 },
        { id: user1.id },
        { id: 2 },
        { id: user2.id },
        { id: 1 },
        { id: user1.id },
        { id: 2 },
        { id: user2.id },
      ],
    };

    const res = await useCase!.execute(anyUsers);

    const existingUsers: FilterExistingUsersDto = {
      users: [{ id: user1.id }, { id: user2.id }],
    };
    expect(res).toEqual(existingUsers);
  });

  afterAll(async () => {
    await dataSource.destroy();
    app = null;
  });
});
