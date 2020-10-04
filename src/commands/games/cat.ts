import CommandInt from "@Interfaces/CommandInt";

const cat: CommandInt = {
  name: "cat",
  description: "A cat walked across the keyboard!",
  run: async (message) => {
    const { channel, sleep } = message;

    // Get a random length for the new string.
    const len = ~~(Math.random() * 100);

    // Create an empty string.
    let str = "";

    for (let i = 0; i < len; i++) {
      // Get a random character.
      const char = ~~(Math.random() * 26 + 64);

      // Append the character to the string.
      str += String.fromCharCode(char);
    }

    // Send the new string to the current channel.
    await channel.send(str);

    // Sleep by 1 second.
    await sleep(1000);

    // Send a message to the current channel.
    await channel.send("Oops! A cat walked across my keyboard!");
  },
};

export default cat;
