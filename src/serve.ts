import { botConnect } from "./botConnect";
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import { beccaLogger } from "./utils/beccaLogger";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

botConnect().catch((err) => beccaLogger.log("error", err));
