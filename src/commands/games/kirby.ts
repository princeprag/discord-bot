import CommandInt from "@Interfaces/CommandInt";

const kirby: CommandInt = {
  name: "kirby",
  description: "Do a little dance... make a little noise... GET DOWN TONIGHT!",
  run: async (message) => {
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
  },
};

export default kirby;
