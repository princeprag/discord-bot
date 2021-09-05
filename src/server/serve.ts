import { readFile } from "fs/promises";
import http from "http";
import https from "https";

import express from "express";

import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { beccaLogHandler } from "../utils/beccaLogHandler";

/**
 * Spins up a basic web server for uptime monitoring.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @returns {boolean} True if the server was started, false if it crashed.
 */
export const createServer = async (Becca: BeccaInt): Promise<boolean> => {
  try {
    const HTTPEndpoint = express();

    HTTPEndpoint.use("/", (_, res) => {
      res.status(200).send("Ping!");
    });

    const httpPort = 1080;

    const httpServer = http.createServer(HTTPEndpoint);

    httpServer.listen(httpPort, () => {
      beccaLogHandler.log("http", `http server is live on port ${httpPort}`);
    });

    if (process.env.NODE_ENV === "production") {
      const privateKey = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/privkey.pem",
        "utf8"
      );
      const certificate = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/cert.pem",
        "utf8"
      );
      const ca = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/chain.pem",
        "utf8"
      );

      const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
      };

      const httpsServer = https.createServer(credentials, HTTPEndpoint);
      httpsServer.listen(1443, () => {
        beccaLogHandler.log("http", "https server is live on port 443");
      });
    }
    return true;
  } catch (err) {
    beccaErrorHandler(Becca, "create server", err);
    return false;
  }
};
