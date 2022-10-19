import { createDatabase } from "typeorm-extension";
import { dbOptions } from "../infra/database/config/configDB";
import { dataSource } from "./factory";

export abstract class UsersDB {
  public static async connect(): Promise<void> {
    await createDatabase({
      options: dbOptions,
      ifNotExist: true,
    });

    await dataSource
      .initialize()
      .then(() => {
        console.log("Connected to Users PostgreSQL!");
      })
      .catch((error) => {
        console.log(`Error to connect to Users PostgreSQL: ${error}`);
      });
  }
}
