import { expect } from "chai";
import { createSandbox, SinonSandbox, SinonStub } from "sinon";
import { ImportMock } from "ts-mock-imports";
import * as TrackingList from "@Utils/commands/trackingList";
import * as LevelsListener from "@Listeners/levelsListener";
import { MessageInt } from "@Interfaces/MessageInt";

import { interceptedLevelsListener } from "@Listeners/interceptableLevelsListener";

describe("interceptedLevelsListener", () => {
  let sandbox: SinonSandbox;
  let isTrackableUser: SinonStub;
  let levelsListenrRun: SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();
    isTrackableUser = sandbox.stub();
    levelsListenrRun = sandbox.stub();
    const levelsStub = {
      name: "Stub Levels",
      description: "Stub Desc",
      run: levelsListenrRun,
    }

    ImportMock.mockOther(TrackingList, "isTrackableUser", isTrackableUser);
    ImportMock.mockOther(LevelsListener, "default", levelsStub);
  });

  afterEach(() => {
    sandbox.restore();
    ImportMock.restore();
  });

  it("should have one interceptor assigned", () => {
    expect(interceptedLevelsListener.getCount()).to.equal(1);
  });

  describe("run()", () => {
    context("when user is trackable", () => {
      it("should call levelsListener", async () => {
        isTrackableUser.returns(true);
        levelsListenrRun.resolves();
        const message: MessageInt = {
          channel: {
            guild: {
              id: "1",
            },
          },
          author: {
            id: "1",
          },
        } as MessageInt;

        await interceptedLevelsListener.run(message);

        expect(isTrackableUser).calledWith("1");
        expect(levelsListenrRun).calledWith(message);
      });
    });
    context("when user is not trackable", () => {
      it("should not call levelsListener", async () => {
        isTrackableUser.returns(false);
        levelsListenrRun.resolves();
        const message: MessageInt = {
          channel: {
            guild: {
              id: "1",
            },
          },
          author: {
            id: "1",
          },
        } as MessageInt;

        await interceptedLevelsListener.run(message);

        expect(isTrackableUser).calledWith("1");
        expect(levelsListenrRun).not.called;
      });
    });
  });
});
