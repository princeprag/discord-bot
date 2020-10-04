import { expect } from "chai";
import { createSandbox } from "sinon";
import { Message, TextChannel, User } from "discord.js";
import * as TOO from "../../../src/interfaces/TrackingOptOutInt";
import {
  mock,
  when,
  verify,
  anyFunction,
  anything,
  resetCalls,
} from "ts-mockito";
import { ImportMock } from "ts-mock-imports";

const sandbox = createSandbox();
const TrackingOptOutDbMock = mock<TOO.TrackingOptOutInt>();
const TrackingOptOutMock = ImportMock.mockFunction(
  TOO,
  "TrackingOptOut",
  TrackingOptOutDbMock
);

import {
  MESSAGE_COMMAND_INVALID,
  MESSAGE_SUBCOMMAND_INVALID,
  saveCallBack,
  trackingOptOut,
} from "../../../src/commands/trackingOptOut";

const buildMessageWithContent = (
  content: string,
  userId: string,
  authorName: string
): Message => {
  const author: User = { id: userId, username: authorName } as User;
  const channel: TextChannel = { send: sandbox.stub() } as Text;
  const msg: Partial<Message> = {
    author,
    content,
    channel,
  };
  return msg as Message;
};

describe("command opt-out", () => {
  context("when command invalid", () => {
    it("return error message", async () => {
      const testMessage: Message = buildMessageWithContent(
        "|outOut add",
        "123456789",
        "author"
      );

      await trackingOptOut.command(testMessage);

      expect(testMessage.channel.send).calledOnceWith(MESSAGE_COMMAND_INVALID);
    });
  });

  context("when subcommand invalid", () => {
    it("return error message", async () => {
      const testMessage: Message = buildMessageWithContent(
        "|optOut",
        "123456789",
        "author"
      );

      await trackingOptOut.command(testMessage);

      expect(testMessage.channel.send).calledOnceWith(
        MESSAGE_SUBCOMMAND_INVALID
      );
    });
  });
  context("when subcommand add", () => {
    context("database available", () => {
      afterEach(() => {
        resetCalls(TrackingOptOutDbMock);
      });
      describe("command: !optOut add", () => {
        describe("user not in database", () => {
          it("attempt to add user id to database", async () => {
            const testMessage: Message = buildMessageWithContent(
              "|optOut add",
              "123456789",
              "author"
            );
            const document: TOO.TrackingOptOutInt = {
              userId: "123456789",
            } as TOO.TrackingOptOutInt;
            testMessage.content = "|optOut add";

            await trackingOptOut.command(testMessage);

            expect(TrackingOptOutMock).calledOnceWith({ userId: "123456789" });
          });
          it("should notify user they are now opt-out", async () => {
            const testMessage: Message = buildMessageWithContent(
              "|optOut add",
              "123456789",
              "author"
            );
            testMessage.content = "|optOut add";
            const document: TOO.TrackingOptOutInt = {
              userId: "123456789",
            } as TOO.TrackingOptOutInt;
            await saveCallBack(testMessage, "author")(null, document);

            expect(testMessage.channel.send).calledWith(
              `@author, you are now opt-out of tracking.`
            );
          });
          it("should notify user if opt-out failed", async () => {
            const testMessage: Message = buildMessageWithContent(
              "|optOut add",
              "123456789",
              "author"
            );
            const document: TOO.TrackingOptOutInt = {
              userId: "123456789",
            } as TOO.TrackingOptOutInt;
            try {
              await saveCallBack(testMessage, "author")(
                new Error("Something"),
                null
              );
            } catch (error) {
              expect(testMessage.channel.send).calledWith(
                `Oops, @author, something went wrong. Please try again in a few minutes.`
              );
            }
          });
        });
      });
    });
  });
});
