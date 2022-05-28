import "reflect-metadata"
import { DataSource, DataSourceOptions } from 'typeorm'
import { UserEntity } from "../schemas/UserEntity";

export const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "event-manager",
  entities: [UserEntity],
  synchronize: true,
  logging: false,
};

export const AppDataSource = new DataSource(dbOptions);