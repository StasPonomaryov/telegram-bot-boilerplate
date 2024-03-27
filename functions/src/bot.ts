// eslint-disable-next-line import/no-extraneous-dependencies
import { Middleware, session } from 'telegraf';
import { Firestore } from 'firebase-admin/firestore';
import { info } from 'firebase-functions/logger';
import { realtimeDb } from './database';
import firebaseSession from './middleware/telegraf-session-firebase-local';
import create from './bot-factory';
import * as utils from './utils';
import CloudDb from './db/cloudDb';
import { Keys, CustomContext } from './types';

// get session depend on local/dev
const getSession = () => {
  if (utils.isLocal()) {
    return session();
  }

  return firebaseSession(realtimeDb.ref('sessions'));
};
/**
 * Main bot function
 * @param config - bot settings
 * @param database - bot's data store
 */
const Bot = (config: Keys, database: Firestore) => {
  const cloud = new CloudDb(database);
  info('>>>CONFIG IN BOT', config);
  return create(
    getSession() as Middleware<CustomContext>,
    config,
    cloud,
  );
};

export default Bot;
