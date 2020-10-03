import { Client } from "discord.js";

export const configureClient = async (baseClient: ?Client): Promise<Client> => {
  const client = baseClient ? baseClient : new Client();
  const token = process.env.DISCORD_TOKEN ?? "";
  await client
    .login(token)
    .then(() => {
      console.info(`Successfully logged in`);
    })
    .catch((e) => console.error(e));
  return client;
};
