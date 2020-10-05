import { Message } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import {
  TrackingOptOut,
  TrackingOptOutInt,
} from "../interfaces/TrackingOptOutInt";

export const VALID_SUBCOMMAND = ["add", "remove", "status"];
export const MESSAGE_COMMAND_INVALID = `Sorry, I did not get that.`;
export const MESSAGE_SUBCOMMAND_INVALID = `Sorry, I did not get that. Try: ${VALID_SUBCOMMAND.join(
  " or "
)}.`;

export const addCallBack = (message: Message, authorName: string) => (
  err?: Error,
  data?: TrackingOptOutInt
): Promise<TrackingOptOutInt> => {
  console.debug(`${data}`);
  if (data) {
    message.channel.send(`@${authorName}, you are now opt-out of tracking.`);
    return Promise.resolve(data);
  }
  if (err) {
    console.error(err);
    message.channel.send(
      `Oops, @${authorName}, something went wrong. Please try again in a few minutes.`
    );
  }
  return Promise.reject(err);
};

export const removeCallback = (message: Message) => (err?: Error): void => {
  const authorName = message?.author?.username;
  if (!err) {
    message.channel.send(`@${authorName}, you are now opted into tracking.`);
  } else {
    console.error(err);
    message.channel.send(
      `Oops, @${authorName}, something went wrong. Please try again in a few minutes.`
    );
  }
};

const statusResolve = (
  message: Message,
  authorName: string,
  subcommand: string
) => (data: TrackingOptOutInt | null): TrackingOptOutInt | null => {
  const optStatus: string = data === null || data === undefined ? "in" : "out";
  if (subcommand === "status") {
    message.channel.send(`@${authorName} is currently opted-${optStatus}`);
  }
  return data ?? null;
};

export const trackingOptOut: CommandInt = {
  prefix: "optOut",
  description:
    "**Add** or **remove** self from being recorded as part of usage statistics",
  parameters: `\`<action>\` - Actions available add, remove, or status
    \nadd - add username to set of opt-out users (disable tracking)
    \nremove - remove username to set of opt-out users (enable tracking)
    \nstatus - see if your current tracking status
    \n`,
  command: async (message: Message) => {
    const [command, subcommand] = message?.content?.trim().split(/\s{1,}/, 2);
    if (!command?.match(/.{1}optOut/)) {
      message.channel.send(MESSAGE_COMMAND_INVALID);
      return;
    }
    if (!VALID_SUBCOMMAND.includes(subcommand)) {
      message.channel.send(MESSAGE_SUBCOMMAND_INVALID);
      return;
    }
    if (process.env.PRODDEV === "development") {
      console.debug(`Command: ${command}`);
      console.debug(`Sub-Command: ${subcommand}`);
      console.debug(`Author: ${JSON.stringify(message.author)}`);
    }
    const userId = message?.author?.id;
    const authorName = message?.author?.username;
    const found = await TrackingOptOut.findOne({ userId })
      .then(statusResolve(message, authorName, subcommand))
      .catch((err) => {
        console.error(err);
        message?.channel?.send(
          `Oops, @${authorName}, something went wrong. Please try again in a few minutes.`
        );
        return null;
      });

    const recordExists = !!found;
    console.log(`${JSON.stringify(found)} ${recordExists}`);

    if (subcommand === "add" && !recordExists) {
      const newOptOutUser = new TrackingOptOut({
        userId,
      });
      await newOptOutUser.save(addCallBack(message, authorName));
    }
    if (subcommand === "add" && recordExists) {
      statusResolve(message, authorName, "status")(found);
    }
    if (subcommand === "remove" && recordExists) {
      await TrackingOptOut.deleteMany({ userId }, removeCallback(message));
    }
    if (subcommand === "remove" && !recordExists) {
      statusResolve(message, authorName, "status")(found);
    }
  },
};
