import { Message } from "discord.js";
import CommandInt from "@Interfaces/CommandInt";
import { TrackingOptOut, TrackingOptOutInt } from "@Models/TrackingOptOutModel";
import MessageInt from "@Interfaces/MessageInt";
import { isTrackableUser, trackUser } from "@Utils/commands/trackingList";

export const VALID_SUBCOMMAND = ["add", "remove", "status"];
export const MESSAGE_COMMAND_INVALID = `Sorry, I did not get that.`;
export const MESSAGE_SUBCOMMAND_INVALID = `Sorry, I did not get that. Try: ${VALID_SUBCOMMAND.join(
  " or "
)}.`;

export const addCallBack = (message: Message, authorId: string) => (
  err?: Error,
  data?: TrackingOptOutInt
): Promise<TrackingOptOutInt> => {
  if (data) {
    trackUser(data.user_id, false);
    message.channel.send(`<@${authorId}>, you are now opt-out of tracking.`);
    return Promise.resolve(data);
  }
  if (err) {
    console.error(err);
    message.channel.send(
      `Oops, <@${authorId}>, something went wrong. Please try again in a few minutes.`
    );
  }
  return Promise.reject(err);
};

export const removeCallback = (message: Message) => (err?: Error): void => {
  const authorId = message?.author?.id;
  if (!err) {
    trackUser(authorId, true);
    message.channel.send(`<@${authorId}>, you are now opted into tracking.`);
  } else {
    console.error(err);
    message.channel.send(
      `Oops, <@${authorId}>, something went wrong. Please try again in a few minutes.`
    );
  }
};

const statusResolve = (
  message: Message,
  authorName: string,
  subcommand: string
) => (canTrackUser: boolean | null): boolean | null => {
  const optStatus: string = canTrackUser ? "in" : "out";
  if (subcommand === "status") {
    message.channel.send(`<@${authorName}> is currently opted-${optStatus}`);
  }
  return canTrackUser ?? null;
};

export const trackingOptOut: CommandInt = {
  name: "optout",
  description:
    "**Add** or **remove** self from being recorded as part of usage statistics",
  parameters: [
    `\`<action>\` - Actions available add, remove, or status
    \nadd - add username to set of opt-out users (disable tracking)
    \nremove - remove username to set of opt-out users (enable tracking)
    \nstatus - see if your current tracking status
    \n`,
  ],
  run: async (message: MessageInt) => {
    const [command, subcommand] = message?.content?.trim().split(/\s{1,}/, 2);
    if (!command?.match(/.{1}optout/)) {
      message.channel.send(MESSAGE_COMMAND_INVALID);
      return;
    }
    if (!VALID_SUBCOMMAND.includes(subcommand)) {
      message.channel.send(MESSAGE_SUBCOMMAND_INVALID);
      return;
    }

    const userId = message?.author?.id;
    const canTrackableUser = isTrackableUser(userId);

    if (subcommand === "status") {
      await statusResolve(message, userId, "status")(canTrackableUser);
      return;
    }

    if (subcommand === "add" && canTrackableUser) {
      const newOptOutUser = new TrackingOptOut({
        user_id: userId,
      });
      await newOptOutUser.save(addCallBack(message, userId));
      return; // exit run fn
    }
    if (subcommand === "add" && !canTrackableUser) {
      statusResolve(message, userId, "status")(canTrackableUser);
      return; // exit run fn
    }
    if (subcommand === "remove" && !canTrackableUser) {
      await TrackingOptOut.deleteMany(
        { user_id: userId },
        removeCallback(message)
      );

      return; // exit run fn
    }
    if (subcommand === "remove" && canTrackableUser) {
      statusResolve(message, userId, "status")(canTrackableUser);
      return; // exit run fn
    }
  },
};

export default trackingOptOut;
