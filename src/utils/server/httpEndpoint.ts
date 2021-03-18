import express from "express";
import http from "http";
import https from "https";
import { readFile } from "fs/promises";

export const endpoint = async (): Promise<void> => {
  const HTTPEndpoint = express();

  HTTPEndpoint.use("/", (req, res) => {
    res.status(200).send("Ping!");
  });

  const httpPort = process.env.NODE_ENV === "production" ? 80 : 8080;

  const httpServer = http.createServer(HTTPEndpoint);

  httpServer.listen(httpPort, () => {
    console.log(`http server is live on port ${httpPort}`);
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
    httpsServer.listen(443, () => {
      console.log("https server is live on port 443");
    });
  }
};
