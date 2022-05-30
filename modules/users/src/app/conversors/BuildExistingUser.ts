import { User } from "../../domain/entities/User";
import { IUser } from "../interfaces/IUser";

export abstract class BuildExistingUser {
  public static execute(user: IUser): User {
    const { id, email, name, password } = user;

    return new User({ id: id!, email, name, password });
  }
}
