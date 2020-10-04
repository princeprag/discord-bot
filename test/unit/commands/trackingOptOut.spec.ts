import { expect } from "chai";
import { createSandbox } from "sinon";
import { Message, TextChannel, User } from "discord.js";
import * as TOO from "../../../src/interfaces/TrackingOptOutInt";
import { mock } from "ts-mockito";
import { ImportMock, MockManager } from "ts-mock-imports";

const sandbox = createSandbox();

import {
  removeCallback,
  MESSAGE_COMMAND_INVALID,
  MESSAGE_SUBCOMMAND_INVALID,
  addCallBack,
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
  let TrackingOptOutDocumentMock;
  let TrackingOptOutMock: MockManager<TOO.TrackingOptOutInt>;
  let findOne: sinon.SinonStub;
  const userRec = {
    userId: "123456789",
  };

  beforeEach(() => {
    findOne = sandbox.stub();
    findOne.resolves(null);

    sandbox.replace(TOO.TrackingOptOut, "findOne", findOne);
    TrackingOptOutDocumentMock = mock<TOO.TrackingOptOutInt>();
    TrackingOptOutMock = ImportMock.mockFunction(
      TOO,
      "TrackingOptOut",
      TrackingOptOutDocumentMock
    );
  });

  afterEach(() => {
    sandbox.restore();
    ImportMock.restore();
  });

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

  context("when subcommand valid", () => {
    describe("command: !optOut add", () => {
      it("attempt to add user id to database", async () => {
        const testMessage: Message = buildMessageWithContent(
          "   |optOut                  add   ",
          "123456789",
          "author"
        );
        const document: TOO.TrackingOptOutInt = {
          userId: "123456789",
        } as TOO.TrackingOptOutInt;

        await trackingOptOut.command(testMessage);

        expect(TrackingOptOutMock).calledOnceWith({
          userId: "123456789",
        });
      });
      describe("addCallBack called", () => {
        it("should notify user they are now opt-out", async () => {
          const testMessage: Message = buildMessageWithContent(
            "|optOut add",
            "123456789",
            "author"
          );
          const document: TOO.TrackingOptOutInt = {
            userId: "123456789",
          } as TOO.TrackingOptOutInt;
          await addCallBack(testMessage, "author")(null, document);

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
            await addCallBack(testMessage, "author")(
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
    describe("command: !optOut remove", () => {
      beforeEach(() => {
        ImportMock.restore();
        findOne.resolves(userRec);
        sandbox.stub(TOO.TrackingOptOut, "find");
        sandbox.stub(TOO.TrackingOptOut, "deleteMany");
      });
      it("call deleteMany to remove records", async () => {
        const testMessage: Message = buildMessageWithContent(
          "   |optOut remove   ",
          "123456789",
          "author"
        );

        await trackingOptOut.command(testMessage);

        expect(TOO.TrackingOptOut.deleteMany).calledWith({
          userId: "123456789",
        });
      });
      describe("removeCallBack called", () => {
        it("warn user if error occured", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut remove   ",
            "123456789",
            "author"
          );

          await removeCallback(testMessage)(new Error());

          expect(testMessage.channel.send).calledWith(
            `Oops, @author, something went wrong. Please try again in a few minutes.`
          );
        });
        it("notify user of status change", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut remove   ",
            "123456789",
            "author"
          );

          await removeCallback(testMessage)(null);

          expect(testMessage.channel.send).calledWith(
            `@author, you are now opted into tracking.`
          );
        });
      });
    });
    describe("command: !optOut status", () => {
      it("call find to recieve records", async () => {
        const testMessage: Message = buildMessageWithContent(
          "   |optOut status   ",
          "123456789",
          "author"
        );
        findOne.resolves(userRec);

        await trackingOptOut.command(testMessage);

        expect(TOO.TrackingOptOut.findOne).calledWith(userRec);
      });
      context("user not found", () => {
        it("notify user they are opt-in", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut status   ",
            "123456789",
            "author"
          );
          findOne.resolves(null);
          await trackingOptOut.command(testMessage);

          expect(testMessage.channel.send).calledWith(
            `@author is currently opted-in`
          );
        });
      });
      context("user found", () => {
        it("notify user they are opt-out", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut status   ",
            "123456789",
            "author"
          );
          findOne.resolves(userRec);

          await trackingOptOut.command(testMessage);

          expect(testMessage.channel.send).calledWith(
            `@author is currently opted-out`
          );
        });
      });
      context("error occured", () => {
        it("notify user an error occured", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut status   ",
            "123456789",
            "author"
          );
          findOne.rejects("Fake Error");

          await trackingOptOut.command(testMessage);

          expect(testMessage.channel.send).calledWith(
            `Oops, @author, something went wrong. Please try again in a few minutes.`
          );
        });
      });
    });
  });
});
