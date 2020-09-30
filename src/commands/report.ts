import { MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";

export const report: CommandInt = {
  prefix: "report",
  description: "Generates a link to the issues page",
  parameters: "*none*",
  command: (message) => {
    const reportEmbed: MessageEmbed = new MessageEmbed().setDescription(
      "Found a bug in me? Report an issue [here](https://github.com/nhcarrigan/discord-bot/issues/new?assignees=nhcarrigan&labels=type%3A+bug%2C+status%3A+triage&template=bug_report.md&title=%5BBUG%5D)."
    );
    message.channel.send(reportEmbed);
  },
};
