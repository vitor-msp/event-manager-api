import { UserEntity } from "../../../../users/src/infra/database/schemas/UserEntity";
import { dataSource } from "../../../../users/src/main/factory";

type InputDto = {
  email: string;
  name: string;
  password: string;
};

export const insertUser = async (input: InputDto): Promise<number> => {
  const { email, name, password } = input;

  const user = new UserEntity();
  user.email = email;
  user.name = name;
  user.password = password;

  await dataSource.getRepository(UserEntity).save(user);

  return user.id;
};
