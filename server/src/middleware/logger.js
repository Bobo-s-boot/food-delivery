import fs from "fs";
import path from "path";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";

export const logger = (req, res, next) => {
  const logDir = path.join(process.cwd(), "logs");
  const fileName = "server.log";

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const time = new Date().toISOString();

  const originalSend = res.send;
  res.send = function (...args) {
    const logMessage = `[${time}] ${req.method} ${req.path} -> ${res.statusCode}\n`;

    fs.appendFile(path.join(logDir, fileName), logMessage, (err) => {
      if (err)
        console.error(
          SERVER_ERORR_MESSAGE?.FIELD_TO_LOG || "Failed to log",
          err,
        );
    });

    console.log(`[${time}] ${req.method} ${req.path} -> ${res.statusCode}`);

    return originalSend.apply(this, args);
  };

  next();
};
