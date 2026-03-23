import fs from "fs";
import path from "path";
import { SERVER_ERORR_MESSAGE } from "../../errors/erorr.js";

export const logger = (req, res, next) => {
  const logDir = "/logs";

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const time = new Date().toISOString();
  const logMessage = `[${time}] ${req.method}, ${req.url}`;

  fs.appendFile(path.join(logDir, "server.log"), logMessage + "\n", (err) => {
    if (err) console.error(SERVER_ERORR_MESSAGE.FIELD_TO_LOG, err);
  });

  console.log(logMessage.trim());
  next();
};
