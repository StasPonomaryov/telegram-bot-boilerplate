// eslint-disable-next-line import/no-extraneous-dependencies
import * as Sentry from '@sentry/google-cloud-serverless';
import { Request, Response } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
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

const botWebhook = onRequest(
  {
    region: 'europe-west1', 
  },
  Sentry.wrapHttpFunction(async (req: Request, res: Response) => {
    try {
      botWebhookHandler(req, res);
    } catch (err) {
      Sentry.captureException(err);
      res.status(500).send(`Internal error: ${(err as Error).message}`);
    }
  }),
);

export default botWebhook;
