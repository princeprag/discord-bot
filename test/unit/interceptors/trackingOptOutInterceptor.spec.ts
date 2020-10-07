import { expect } from "chai";
import { Message } from "discord.js";
import { createSandbox } from "sinon";

import * as TrackingList from "@Utils/commands/trackingList";
import { trackingOptOutInterceptor } from "@Interceptors/trackingOptOutInterceptor";
import { InterceptInt } from "@Interfaces/interceptor/InterceptInt";

const sandbox = createSandbox();
const isTrackableUser = sandbox.stub();
before(() => {
  sandbox.replace(TrackingList, "isTrackableUser", isTrackableUser);
});

describe("TrackingOptOutInterceptor", () => {
  afterEach(() => {
    isTrackableUser.resetHistory();
  })
  describe("next()", () => {
    beforeEach(() => {
      isTrackableUser.returns(true);
    });
    context("when next is undefined", () => {
      it("should resolve", async () => {
        const message = sandbox.createStubInstance<Message>(Message);
        trackingOptOutInterceptor.setNext(undefined);
        const val = await trackingOptOutInterceptor.intercept(message);

        expect(val).to.be.undefined;
        expect(trackingOptOutInterceptor.next).to.be.undefined;
      });
    });
    context("when next is MessageListenerHandler", () => {
      it("should await call listener", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const listenerStub = sandbox.stub();
        listenerStub.callsFake((message: Message) => {
          return Promise.resolve("hi");
        });

        trackingOptOutInterceptor.setNext(listenerStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(trackingOptOutInterceptor.next).to.be.equal(listenerStub);
        expect(listenerStub).to.be.calledOnceWith(messageStub);
      });
    });
    context("when next is interceptor", () => {
      it("should call intercept on next interceptor with message", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const interceptorStub: InterceptInt = {
          setNext: sandbox.stub(),
          next: sandbox.stub(),
          intercept: sandbox.stub(),
        };
        interceptorStub.intercept.resolves({});

        trackingOptOutInterceptor.setNext(interceptorStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(trackingOptOutInterceptor.next).to.be.equal(interceptorStub);
        expect(interceptorStub.intercept).to.be.calledOnceWith(messageStub);
      });
    });
  });
  describe("intercept", () => {
    context("user in opt-out global", () => {
      it("should not call next fn", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const listenerStub = sandbox.stub();
        isTrackableUser.returns(false);

        trackingOptOutInterceptor.setNext(listenerStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(listenerStub).not.called;
      });
    });
    context("user not in opt-out global", () => {
      it("should call next fn", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const listenerStub = sandbox.stub();
        isTrackableUser.returns(true);

        trackingOptOutInterceptor.setNext(listenerStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(listenerStub).calledWith(messageStub);
      });
    });
  });
});
