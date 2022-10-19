import "reflect-metadata";
import { DataSourceOptions } from "typeorm";
import { UserEntity } from "../schemas/UserEntity";
import dotenv from "dotenv";

dotenv.config();

export const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.USERS_DB_HOST,
  port: +process.env.USERS_DB_PORT!,
  username: process.env.USERS_DB_USERNAME,
  password: process.env.USERS_DB_PASSWORD,
  database: "event-manager",
  entities: [UserEntity],
  synchronize: true,
  logging: false,
};