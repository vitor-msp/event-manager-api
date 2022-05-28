import { UserInputData } from "../types/UserInputData";
import { UserOutputData } from "../types/UserOutputData";
import * as EmailValidator from "email-validator";
import { InvalidEmailError } from "../errors/InvalidEmailError";
import { InvalidNameError } from "../errors/InvalidNameError";

export class User {
  private readonly id: number | null;
  private email!: string;
  private name!: string;
  private password!: string;

  constructor(userData: UserInputData) {
    this.id = userData.id ?? null;
    const { name, email, password } = userData;
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
  }

  private setName(name: string): void {
    if (name.length === 0) throw new InvalidNameError();
    this.name = name;
  }

  private setEmail(email: string): void {
    if (!EmailValidator.validate(email)) throw new InvalidEmailError();
    this.email = email;
  }

  private setPassword(password: string): void {
    this.password = password;
  }

  public getData(): UserOutputData {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }

  public passwordIsCorrect(password: string): boolean {
    return this.password === password;
  }
}
