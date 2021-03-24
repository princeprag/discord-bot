import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const kirby: CommandInt = {
  name: "kirby",
  description: "Do a little dance... make a little noise... GET DOWN TONIGHT!",
  category: "game",
  run: async (message) => {
    try {
      const { channel, sleep } = message;

      await channel.send("Dance with me!");
      await sleep(1000);
      await channel.send("<('.')>");
      await sleep(1000);
      await channel.send("<('.')<");
      await sleep(1000);
      await channel.send(">('.')>");
      await sleep(1000);
      await channel.send("^('.')^");
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "kirby command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default kirby;
