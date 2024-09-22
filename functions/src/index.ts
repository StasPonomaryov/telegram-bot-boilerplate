// eslint-disable-next-line import/no-extraneous-dependencies
import * as Sentry from '@sentry/google-cloud-serverless';
import { onRequest, Request } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import botWebhookHandler from './handlers/botWebhook';

const sentryDsn = process.env.SENTRY_DSN;
const sentryEnv = process.env.SENTRY_ENV;

setGlobalOptions({ region: 'europe-central2' });
/**
 * Init Sentry
 */
Sentry.init({
  dsn: sentryDsn,
  enabled: true,
  environment: sentryEnv,
  tracesSampleRate: 1.0,
});

export const botWebhook = onRequest(
  {
    region: 'europe-west1', // More closer to Telegram servers
  },
  Sentry.wrapHttpFunction(async (req, res) => {
    try {
      botWebhookHandler(req as Request, res);
    } catch (err) {
      Sentry.captureException(err);
      res.status(500).send(`Internal error: ${(err as Error).message}`);
    }
  }),
);

export default botWebhook;
