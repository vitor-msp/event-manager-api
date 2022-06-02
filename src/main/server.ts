import { App } from "./app";

(async () => {
  const port = process.env.PORT || 8080;

  const app = await new App().run();

  app.express.listen(port, () => console.log(`Api stated on port ${port}!`));
})();
