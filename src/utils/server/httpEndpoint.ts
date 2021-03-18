import express from "express";
import https from "https";

export const endpoint = (): void => {
  const HTTPEndpoint = express();

  HTTPEndpoint.use("/", (req, res) => {
    res.status(200).send("Ping!");
  });

  const server = https.createServer(HTTPEndpoint);

  server.listen(8000, () => {
    console.log("server is live on port 8000");
  });
};
