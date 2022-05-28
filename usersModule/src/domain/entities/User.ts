import { UserInputDto } from "../types/UserInputDto";
import { UserOutputDto } from "../types/UserOutputDto";
import * as EmailValidator from "email-validator";
import { InvalidEmailError } from "../errors/InvalidEmailError";
import { InvalidNameError } from "../errors/InvalidNameError";
import { EncryptData } from "../helpers/EncryptData";
import { CompareEncryptedData } from "../helpers/CompareEncryptedData";
import { InvalidPasswordError } from "../errors/InvalidPasswordError";

export class User {
  private readonly id: number | null;
  private email!: string;
  private name!: string;
  private password!: string;

  constructor(userData: UserInputDto) {
    this.id = userData.id ?? null;
    const { name, email, password } = userData;
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
  }

  public setName(name: any): void {
    if (name.length === 0) throw new InvalidNameError();

    if (!isNaN(name)) throw new InvalidNameError();

    if (!isNaN(new Date(name).getDate())) throw new InvalidNameError();

    this.name = name;
  }

  private setEmail(email: string): void {
    if (!EmailValidator.validate(email)) throw new InvalidEmailError();
    this.email = email;
  }

  private setPassword(password: string): void {
    this.password = EncryptData.execute(password);
  }

  public getData(): UserOutputDto {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }

  public passwordIsCorrect(password: string): boolean {
    return CompareEncryptedData.execute(password, this.password);
  }

  public changePassword(newPass: string, currentPass: string): void {
    if (!this.passwordIsCorrect(currentPass)) throw new InvalidPasswordError();

    this.setPassword(newPass);
  };
}
