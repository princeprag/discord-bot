import { botConnect } from "./botConnect";
import express from "express";

botConnect().catch(console.log);

const app = express();

app.use("/", (_, res) => {
  res.status(200).json({ message: "All good!" });
});
