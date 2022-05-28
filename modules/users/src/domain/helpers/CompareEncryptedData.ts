import bcrypt from "bcryptjs";

export abstract class CompareEncryptedData {
  public static execute(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
