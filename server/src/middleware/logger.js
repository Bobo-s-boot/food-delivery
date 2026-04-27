import fs from "fs";
import path from "path";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";

export const logger = (req, res, next) => {
  const logDir = path.join(process.cwd(), "logs");
  const fileName = "server.log";

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const time = new Date().toISOString();

  let clientMessage = "";
  if (Object.keys(req.body || {}).length > 0) {
    const safeBody = { ...req.body };

    if (safeBody.password) safeBody.password = "***";
    clientMessage = JSON.stringify(safeBody);
  } else if (Object.keys(req.query || {}).length > 0) {
    clientMessage = JSON.stringify(req.query);
  } else {
    clientMessage = "No Payload";
  }

  // Intercept the send method to log the server response
  const originalSend = res.send;
  res.send = function (body) {
    let responseBody = body;

    if (typeof body === "object") {
      try {
        responseBody = JSON.stringify(body);
      } catch (e) {}
    } else if (Buffer.isBuffer(body)) {
      responseBody = "[Buffer Data]";
    }

    const logMessage = `[${time}] ${req.method} ${req.url} | CLIENT_MSG: ${clientMessage} | SERVER_RES: [Status ${res.statusCode}] ${responseBody}\n`;

    fs.appendFile(path.join(logDir, fileName), logMessage, (err) => {
      if (err)
        console.error(
          SERVER_ERORR_MESSAGE?.FIELD_TO_LOG || "Failed to log",
          err,
        );
    });

    console.log(`[${time}] ${req.method} ${req.url} -> ${res.statusCode}`);

    // Call the original method
    return originalSend.apply(this, arguments);
  };

  next();
};
