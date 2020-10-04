import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import { createSandbox, fake } from "sinon";
import { Client, Message, TextChannel, User } from "discord.js";
import * as TrackingInterface from "../../../src/interfaces/TrackingOptOutInt";
import { TrackingOptOut } from "../../../src/interfaces/TrackingOptOutInt";
import {
  trackingOptOut,
  MESSAGE_COMMAND_INVALID,
  MESSAGE_SUBCOMMAND_INVALID,
} from "../../../src/commands/trackingOptOut";

chai.use(sinonChai);

const sandbox = createSandbox();

describe("command opt-out", () => {
  context("when command invalid", () => {
    it("return error message", async () => {
      const channel = sandbox.createStubInstance<TextChannel>(TextChannel, {
        send: sandbox.stub(),
      });
      const testMessage = new Message(null, null, channel);
      testMessage.content = "|hi";

      await trackingOptOut.command(testMessage);

      expect(channel.send).calledOnceWith(MESSAGE_COMMAND_INVALID);
    });
  });
  context("when subcommand invalid", () => {
    it("return error message", async () => {
      const channel = sandbox.createStubInstance<TextChannel>(TextChannel, {
        send: sandbox.stub(),
      });
      const testMessage = new Message(null, null, channel);
      testMessage.content = "|optOut";

      await trackingOptOut.command(testMessage);

      expect(channel.send).calledOnceWith(MESSAGE_SUBCOMMAND_INVALID);
    });
  });
  context("when subcommand add", () => {
    context("database available", () => {
      let doNotTrackService;
      before(() => {
        doNotTrackService = sandbox.createStubInstance<
          model<TrackingOptOutInt>
        >(TrackingOptOut, { save: sandbox.stub() });
        sandbox.stub(TrackingInterface, "TrackingOptOut");
      });
      describe("command: !optOut add", () => {
        context("user not in database", () => {
          it("attempt to add user id to database", async () => {
            const channel = sandbox.createStubInstance<TextChannel>(
              TextChannel,
              { send: sandbox.stub() }
            )
            const data = { id: "data123"};
            const fakeClient = sandbox.createStubInstance<Client>(Client);
            const testMessage = new Message(fakeClient, data, channel);

            testMessage.content = "|optOut add";

            await trackingOptOut.command(testMessage);

            expect(doNotTrackService.save).calledWith({
              userId: "123456789",
            });
            expect(channel.send).calledOnceWith(
              "You are now opt-out of tracking."
            );
          });
        });
      });
    });
  });
});
