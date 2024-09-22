import * as functions from 'firebase-functions';
import { Request } from 'firebase-functions/v2/https';
import { cloudFirestore } from '../database';
import getSettings from '../tools/getSettings';
import { BotMainConfig } from '../types';
import Bot from '../bot';

const keys = {
  bot: {
    token: process.env.BOT_TOKEN,
  },
  ga: {
    tid: process.env.GOOGLE_ANALYTICS,
  },
};

const botWebhookHandler = async (
  request: Request,
  response: functions.Response,
) => {
  const database = cloudFirestore;
  const settings = await getSettings(database).getFromDB();
  // create config for Bot
  const config = {
    keys: {
      ...settings,
      ...keys as BotMainConfig,
    },
  };
  // create Bot instance
  const bot = Bot(config, database);
  try {
    if ('message' in request.body
      && request.body.message.chat.id < 0
      && !('reply_to_message' in request.body.message)) {
      response.status(200).end();
    } else {
      await bot.handleUpdate(request.body);
    }
  } finally {
    response.status(200).end();
  }
};

export default botWebhookHandler;
