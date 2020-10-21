import CommandInt from "@Interfaces/CommandInt";

const kirby: CommandInt = {
  name: "kirby",
  description: "Do a little dance... make a little noise... GET DOWN TONIGHT!",
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
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the kirby command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default kirby;
