import mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connectDb() {
  const dbUrl = config.get<string>("atlasurl");

  try {
    await mongoose.connect(dbUrl);
    log.info("connected to DB");
  } catch (e) {
    log.error(e, "Error when connecting");
    process.exit(1);
  }
}

export default connectDb;
