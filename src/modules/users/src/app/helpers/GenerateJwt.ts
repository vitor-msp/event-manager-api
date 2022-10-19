import jwt from "jsonwebtoken";

export abstract class GenerateJwt {
  public static execute(payload: any): string {
    const jwtKey = process.env.JWT_KEY!;

    const fiveMinutesInSeconds = 60 * 5;

    return jwt.sign(payload, jwtKey, { expiresIn: fiveMinutesInSeconds });
  }
}
