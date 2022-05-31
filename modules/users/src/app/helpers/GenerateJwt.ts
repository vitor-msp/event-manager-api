import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export abstract class GenerateJwt {
  public static execute(payload: any): string {
    dotenv.config();

    const jwtKey = process.env.JWT_KEY!;

    const fiveMinutesInSeconds = 60 * 5;

    return jwt.sign(payload, jwtKey, { expiresIn: fiveMinutesInSeconds });
  }
}
