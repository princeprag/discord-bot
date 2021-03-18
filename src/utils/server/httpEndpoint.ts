import express from "express";
import http from "http";
import https from "https";

export const endpoint = (): void => {
  const HTTPEndpoint = express();

  HTTPEndpoint.use("/", (req, res) => {
    res.status(200).send("Ping!");
  });

  const httpPort = process.env.PRODDEV === "production" ? 80 : 8080;

  const httpServer = http.createServer(HTTPEndpoint);

  httpServer.listen(httpPort, () => {
    console.log(`http server is live on port ${httpPort}`);
  });

  if (process.env.PRODDEV === "production") {
    const httpsServer = https.createServer(HTTPEndpoint);
    httpsServer.listen(443, () => {
      console.log("https server is live on port 443");
    });
  }
};
