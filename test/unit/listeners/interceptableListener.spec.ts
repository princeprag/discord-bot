import { BaseInterceptableListener } from "@Listeners/interceptableListener";
import { interceptorFactory } from "@Interfaces/interceptor/InterceptInt";
import { MessageInt } from "@Interfaces/MessageInt";
import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";

const InterceptableClass = class extends BaseInterceptableListener {
  actionStub: (message: MessageInt) => Promise<boolean>;
  constructor(action) {
    super("", "");
    this.action = action;
  }
};

describe("InterceptableListener - base", () => {
  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
  });
  describe("run()", () => {
    context("when no interceptors provided", () => {
      it("should called action", async () => {
        const actionStub = sandbox.stub();
        actionStub.resolves();
        const fakeListener = new InterceptableClass(actionStub);

        await fakeListener.run(null);

        expect(actionStub).calledWith(null);
      });
    });
    context("when interceptors provided all resolve true", () => {
      it("should call all interceptors action", async () => {
        const actionStub = sandbox.stub();
        actionStub.resolves();
        const interceptorAction = sandbox.stub().resolves(true);
        const first = interceptorFactory(interceptorAction);
        const second = interceptorFactory(interceptorAction);
        const third = interceptorFactory(interceptorAction);

        const fakeListener = new InterceptableClass(actionStub);

        fakeListener.register(first);
        fakeListener.register(second);
        fakeListener.register(third);

        await fakeListener.run(null);

        expect(actionStub).calledWith(null);
        expect(interceptorAction).callCount(3);
      });
    });
    context("when interceptors provided at least one resolve false", () => {
      it("should call not call interceptors after action false or listener action", async () => {
        const actionStub = sandbox.stub();
        actionStub.resolves();
        const interceptorAction = sandbox
          .stub()
          .onCall(0)
          .resolves(true)
          .onCall(1)
          .resolves(false)
          .onCall(2)
          .resolves(true);
        const first = interceptorFactory(interceptorAction);
        const second = interceptorFactory(interceptorAction);
        const third = interceptorFactory(interceptorAction);

        const fakeListener = new InterceptableClass(actionStub);

        fakeListener.register(first);
        fakeListener.register(second);
        fakeListener.register(third);

        await fakeListener.run(null);

        expect(interceptorAction).callCount(2);
        expect(actionStub).not.called;
      });
    });
  });
  describe("register()", () => {
    it("should set new interceptor to call listener action", () => {
      const actionStub = sandbox.stub();
      actionStub.resolves();
      const interceptorAction = sandbox
        .stub()
        .onCall(0)
        .resolves(true)
        .onCall(1)
        .resolves(false)
        .onCall(2)
        .resolves(true);
      const first = interceptorFactory(interceptorAction);
      const second = interceptorFactory(interceptorAction);
      const third = interceptorFactory(interceptorAction);

      const fakeListener = new InterceptableClass(actionStub);

      fakeListener.register(first);
      fakeListener.register(second);
      fakeListener.register(third);

      expect(fakeListener.getCount()).to.equal(3);
    });
  });
});
