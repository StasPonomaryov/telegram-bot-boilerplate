// eslint-disable-next-line import/no-extraneous-dependencies
import * as Sentry from '@sentry/serverless';
import * as functions from 'firebase-functions';
import botWebhookHandler from './handlers/botWebhook';

const keys = functions.config();
/**
 * Init Sentry
 */
Sentry.GCPFunction.init({
  dsn: keys.sentry.dsn,
  enabled: true,
  environment: keys.sentry.environment,
  tracesSampleRate: 1.0,
});

const botWebhook = functions
  .region('europe-west2')
  .https
  .onRequest(
    Sentry.GCPFunction.wrapHttpFunction(async (req, res) => {
      try {
        botWebhookHandler(req as functions.https.Request, res);
      } catch (err) {
        Sentry.captureException(err);
        res.status(500).send(`Internal error: ${(err as Error).message}`);
      }
    }),
  );

export default botWebhook;
