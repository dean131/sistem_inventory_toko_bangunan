import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const APP_PORT = process.env.APP_PORT || 3000;
web.listen(APP_PORT, () => {
    logger.info(`App start on: http://localhost:${APP_PORT}`);
});
