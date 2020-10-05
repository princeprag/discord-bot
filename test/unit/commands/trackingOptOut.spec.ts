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
  let deleteMany: sinon.SinonStub;
  const userRec = {
    userId: "123456789",
  };

  beforeEach(() => {
    findOne = sandbox.stub();
    findOne.resolves();

    deleteMany = sandbox.stub();
    deleteMany.resolves();

    sandbox.replace(TOO.TrackingOptOut, "findOne", findOne);
    sandbox.replace(TOO.TrackingOptOut, "deleteMany", deleteMany);
    TrackingOptOutDocumentMock = mock<TOO.TrackingOptOutInt>();
    TrackingOptOutMock = ImportMock.mockFunction(
      TOO,
      "TrackingOptOut",
      TrackingOptOutDocumentMock
    );
  });

  afterEach(() => {
    ImportMock.restore();
    sandbox.restore();
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
      context("user already exists", () => {
        it("invoke call back without actually adding", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut                  add   ",
            "123456789",
            "author"
          );
          findOne.resolves(userRec);

          await trackingOptOut.command(testMessage);

          expect(TrackingOptOutMock).not.calledOnceWith({
            userId: "123456789",
          });
          expect(testMessage.channel.send).calledWith(
            `<@123456789> is currently opted-out`
          );
        });
      });
      context("user does not exist in db", () => {
        it("attempt to add user id to database", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut                  add   ",
            "123456789",
            "author"
          );
          findOne.resolves();

          await trackingOptOut.command(testMessage);

          expect(TrackingOptOutMock).calledOnceWith({
            userId: "123456789",
          });
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
          await addCallBack(testMessage, "123456789")(null, document);

          expect(testMessage.channel.send).calledWith(
            `<@123456789>, you are now opt-out of tracking.`
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
            await addCallBack(testMessage, "123456789")(
              new Error("Something"),
              null
            );
          } catch (error) {
            expect(testMessage.channel.send).calledWith(
              `Oops, <@123456789>, something went wrong. Please try again in a few minutes.`
            );
          }
        });
      });
    });
    describe("command: !optOut remove", () => {
      it("call deleteMany to remove records", async () => {
        const testMessage: Message = buildMessageWithContent(
          "   |optOut remove   ",
          "123456789",
          "author"
        );
        findOne.resolves(userRec);
        deleteMany.resolves();

        await trackingOptOut.command(testMessage);

        expect(TOO.TrackingOptOut.deleteMany).called;
        expect(deleteMany).calledWith({
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
            `Oops, <@123456789>, something went wrong. Please try again in a few minutes.`
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
            `<@123456789>, you are now opted into tracking.`
          );
        });
      });
    });
    describe("command: !optOut status", () => {
      context("user not found", () => {
        it("call find to recieve records", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut status   ",
            "123456789",
            "author"
          );
          findOne.resolves();

          await trackingOptOut.command(testMessage);

          expect(TOO.TrackingOptOut.deleteMany).not.calledWith(userRec);
        });
        it("notify user they are opt-in", async () => {
          const testMessage: Message = buildMessageWithContent(
            "   |optOut status   ",
            "123456789",
            "author"
          );
          findOne.resolves();
          await trackingOptOut.command(testMessage);

          expect(testMessage.channel.send).calledWith(
            `<@123456789> is currently opted-in`
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
            `<@123456789> is currently opted-out`
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
            `Oops, <@123456789>, something went wrong. Please try again in a few minutes.`
          );
        });
      });
    });
  });
});
