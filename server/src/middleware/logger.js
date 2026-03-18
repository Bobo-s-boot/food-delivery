import fs from "fs";
import path from "path";

export const logger = (req, res, next) => {
  const logDir = "./logs";

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const time = new Date().toISOString();
  const logMassage = `[${time}] ${req.method} ${req.url}`;

  fs.appendFile(path.join(logDir, "server.log"), logMassage + "\n", (err) => {
    if (err) console.error("Failed to write to log file:", err);
  });

  console.log(logMassage.trim());
  next();
};
