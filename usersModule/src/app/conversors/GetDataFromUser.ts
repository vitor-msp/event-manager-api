import { User } from "../../domain/entities/User";
import { IUser } from "../interfaces/IUser";

export abstract class GetDataFromUser {
  public static execute(user: User): IUser {
    const { id, name, email } = user.getData();

    return {
      id: id ?? null,
      name,
      email,
      password: user.getPassword(),
    };
  }
}
