import { createDatabase } from "typeorm-extension";
import { AppDataSource, dbOptions } from "../infra/database/config/configDB";

export abstract class UsersDB {
  public static async connect(): Promise<void> {
    await createDatabase({ options: dbOptions, ifNotExist: true });

    AppDataSource.initialize()
      .then(() => {
        console.log("Connected to Users PostgreSQL!");
      })
      .catch((error) => {
        console.log(`Error to connect to Users PostgreSQL: ${error}`);
      });
  }
}
