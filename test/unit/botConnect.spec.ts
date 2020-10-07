import { expect } from "chai";
import { createSandbox, mock, SinonSandbox, SinonStub } from "sinon";
import * as dbFns from "@Database";
import * as trackingListFns from "@Utils/commands/trackingList";
import * as readDirFns from "@Utils/readDirectory";
import discordjs from "discord.js";
import { ImportMock, MockManager } from "ts-mock-imports";

import { botConnect } from "../../src/botConnect";

describe("main - botConnect()", () => {
  let sandbox: SinonSandbox;
  let connectDatabase: SinonStub;
  let extendsClientToClientInt: SinonStub;
  let loadCurrentTrackingOptOutList: SinonStub;
  let mockClient: MockManager<discordjs.Util>;

  let on: SinonStub;
  let login: SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();
    on = sandbox.stub();
    login = sandbox.stub();
    login.resolves();

    const mockClassClient = sandbox.createStubInstance<discordjs.Client>(
      discordjs.Client,
      {
        on,
        login,
      }
    );

    extendsClientToClientInt = sandbox.stub();
    extendsClientToClientInt.returns(mockClassClient);

    connectDatabase = sandbox.stub();
    connectDatabase.resolves();

    loadCurrentTrackingOptOutList = sandbox.stub();
    loadCurrentTrackingOptOutList.resolves();

    ImportMock.mockClass(discordjs, "WebhookClient");

    mockClient = ImportMock.mockClass(discordjs, "Client");
    mockClient.mock("on", on);
    mockClient.mock("login", login);

    ImportMock.mockFunction(readDirFns, "getCommands", () =>
      Promise.resolve([])
    );
    ImportMock.mockFunction(readDirFns, "getListeners", () =>
      Promise.resolve([])
    );
    sandbox.replace(
      trackingListFns,
      "loadCurrentTrackingOptOutList",
      loadCurrentTrackingOptOutList
    );
    sandbox.replace(dbFns, "default", connectDatabase);
  });

  afterEach(() => {
    ImportMock.restore();
    sandbox.restore();
  });

  context("database available", () => {
    it("should call loadCurrentTrackingOptOutList", async () => {
      connectDatabase.resolves();
      loadCurrentTrackingOptOutList.resolves();

      await botConnect().finally(() => {
        process.emit("disconnect");
      });

      expect(connectDatabase).calledOnce;
      expect(loadCurrentTrackingOptOutList).calledOnce;
    });
  });
});
