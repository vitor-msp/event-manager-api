import bcrypt from "bcryptjs";

export abstract class EncryptData {
  public static execute(plainText: string): string {
    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(plainText, salt);

    return hash;
  }
}
