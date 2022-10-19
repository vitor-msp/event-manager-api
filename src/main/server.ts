import { App } from "./app";
import dotenv from "dotenv";

(async () => {
  dotenv.config();

  const port = process.env.PORT;

  const app = await new App().run();

  app.express.listen(port, () => console.log(`Api stated on port ${port}!`));
})();
