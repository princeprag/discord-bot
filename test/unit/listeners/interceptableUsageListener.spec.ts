import { expect } from "chai";
import { createSandbox, SinonSandbox, SinonStub } from "sinon";
import { ImportMock } from "ts-mock-imports";
import * as TrackingList from "@Utils/commands/trackingList";
import * as UsageListener from "@Listeners/usageListener";
import { MessageInt } from "@Interfaces/MessageInt";

import { interceptedUsageListener } from "@Listeners/interceptableUsageListener";

describe("interceptedUsageListener", () => {
  let sandbox: SinonSandbox;
  let isTrackableUser: SinonStub;
  let usageListenrRun: SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();
    isTrackableUser = sandbox.stub();
    usageListenrRun = sandbox.stub();
    const usageStub = {
      name: "Stub Usage",
      description: "Stub Desc",
      run: usageListenrRun,
    }

    ImportMock.mockOther(TrackingList, "isTrackableUser", isTrackableUser);
    ImportMock.mockOther(UsageListener, "default", usageStub);
  });

  afterEach(() => {
    sandbox.restore();
    ImportMock.restore();
  });

  it("should have one interceptor assigned", () => {
    expect(interceptedUsageListener.getCount()).to.equal(1);
  });

  describe("run()", () => {
    context("when user is trackable", () => {
      it("should call usageListener", async () => {
        isTrackableUser.returns(true);
        usageListenrRun.resolves();
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

        await interceptedUsageListener.run(message);

        expect(isTrackableUser).calledWith("1");
        expect(usageListenrRun).calledWith(message);
      });
    });
    context("when user is not trackable", () => {
      it("should not call usageListener", async () => {
        isTrackableUser.returns(false);
        usageListenrRun.resolves();
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

        await interceptedUsageListener.run(message);

        expect(isTrackableUser).calledWith("1");
        expect(usageListenrRun).not.called;
      });
    });
  });
});
