require("dotenv").config();
import express from "express";
import config from "config";
import log from "./utils/logger";
import connectDb from "./utils/DbConnection";

const app = express();

app.use(express.json());
const port = config.get("port");
app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);

  connectDb();
});
