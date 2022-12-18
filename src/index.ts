import config from "config";
import db from "./model/db";
import app from "./server";
import logger from "./utils/logger";
import { ParamsServer } from "./types/types";

(async () => {
  await db.init();
  try {
    const paramsServer: ParamsServer = config.get("serverConfig");
    app.listen(paramsServer, () => {
      logger.info(
        `Server start on ${paramsServer.host}:${paramsServer.port} with backlog ${paramsServer.backlog}`
      );
    });
  } catch (err) {
    db.close();
    throw err;
  }
})();
