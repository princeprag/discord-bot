import { Client } from "discord.js";

export const configureClient = (baseClient?: Client): Client => {
  const client = baseClient ? baseClient : new Client();
  const token = process.env.DISCORD_TOKEN ?? "";
  client
    .login(token)
    .then(() => {
      console.info("Discored Client Successfully Logged In");
    })
    .catch((e) => console.error(e));
  return client;
};
