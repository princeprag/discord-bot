import { Message } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";

export const VALID_SUBCOMMAND = ["add", "remove", "status"];
export const MESSAGE_COMMAND_INVALID = `Sorry, I did not get that.`;
export const MESSAGE_SUBCOMMAND_INVALID = `Sorry, I did not get that. Try: ${VALID_SUBCOMMAND.join(
  " or "
)}.`;
export const trackingOptOut: CommandInt = {
  prefix: "optOut",
  description:
    "Add or remove self from being recorded as part of usage statistics",
  parameters: `\`<opt-out>\` - [add|remove|status]
    \n\tadd\tadd username to set of opt-out users (disable tracking)
    \n\tremove\tremove username to set of opt-out users (enable tracking)
    \n\tstatus\tsee if your current tracking status
    \n
    `,
  command: async (message: Message) => {
    const [command, subcommand] = message?.content?.trim().split(" ", 2);
    if (!command?.match(/.{1}optOut/)) {
      console.debug(`Command invalid: ${command}`);
      message.channel.send(MESSAGE_COMMAND_INVALID);
      return;
    }
    if (!VALID_SUBCOMMAND.includes(subcommand?.toLowerCase())) {
      console.debug(`SubCommand invalid: ${subcommand}`);
      message.channel.send(MESSAGE_SUBCOMMAND_INVALID);
      return;
    }
    if (process.env.PRODDEV === "development") {
      console.debug(`Command: ${command}`);
      console.debug(`Sub-Command: ${subcommand}`);
      console.debug(`Author: ${JSON.stringify(message.author)}`);
    }
    message.channel.send("Hold on I'm still trying to make this work");
  },
};
