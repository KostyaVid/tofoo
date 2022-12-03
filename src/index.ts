import config from 'config';
import db from './model/db';
import app from './server';
import logger from './utils/logger';
import { IParamsServer } from './types/types';

(async () => {
  await db.init();
  try {
    const paramsServer: IParamsServer = config.get('serverConfig');
    app.listen(paramsServer, () => {
      logger.info(
        `Server start on ${paramsServer.host}:${paramsServer.port} with backlog ${paramsServer.backlog}`,
      );
    });
  } catch (err) {
    db.close();
    throw err;
  }
})();
