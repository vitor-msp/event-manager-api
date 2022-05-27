import { App } from "./app";

const port = process.env.PORT || 8080;

const app = new App();

app.express.listen(port, () => console.log(`Api stated on port ${port}!`));
