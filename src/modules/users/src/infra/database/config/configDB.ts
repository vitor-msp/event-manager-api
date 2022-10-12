import "reflect-metadata"
import {  DataSourceOptions } from 'typeorm'
import { UserEntity } from "../schemas/UserEntity";

export const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  // host: "postgres" || "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "event-manager",
  entities: [UserEntity],
  synchronize: true,
  logging: false,
};