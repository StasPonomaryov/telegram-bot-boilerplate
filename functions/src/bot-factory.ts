/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as Sentry from '@sentry/node';
import {
  Middleware, MiddlewareFn, Telegraf,
} from 'telegraf';
import * as i18n from 'i18next';
import { warn, debug, info } from 'firebase-functions/logger';
import wrapper from './middleware/middleware-wrapper';
import stage from './tools/scenesManager';
import globalListener from './tools/globalListener';
import * as utils from './utils';
import { CustomContext, Keys } from './types';
import CloudDb from './db/cloudDb';
import * as enFile from './locale/en/translation.json';
import * as ukFile from './locale/uk/translation.json';
import { escapeSymbolsMd } from './utils';

const resources = {
  en: {
    translation: enFile,
  },
  uk: {
    translation: ukFile,
  },
};
/**
  * Send error to Sentry
  */
const sendToSentry = (ctx: CustomContext, error: Error) => new Promise<void>((resolve) => {
  Sentry.withScope((scope) => {
    scope.setExtra('update', ctx.update);
    scope.setExtra('session', ctx.session);
    scope.setUser({
      ...ctx.from,
      id: `${ctx.from?.id}`,
    });
    Sentry.captureException(error);
    resolve();
  });
});
/**
 * Last middleware if want to get unhandleded updates
 */
const defaultHandler = async (ctx: CustomContext) => {
  debug('>>> Entering last middleware');
  await sendToSentry(ctx, { name: 'unhandled', message: 'Unhandled request' });

  debug('>>> Exiting last middleware');
};
/**
 * Factory to create bot instance
 */
const create = (session: Middleware<CustomContext>, config: Keys, configDB: CloudDb) => {
  const { keys } = config;
  debug('>>> Entering bot-factory.create()', keys);
  i18n
    .init({
      lng: keys.default_language,
      debug: false,
      fallbackLng: keys.default_language || 'uk',
      resources,
    });
  // declare a bot
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const bot = new Telegraf<CustomContext>(keys.bot!.token);
  // use session
  bot.use(wrapper('session', session as MiddlewareFn<CustomContext>));
  // put necessary data to bot context
  bot.context.configDB = configDB;
  bot.context.keys = keys;
  bot.context.t = i18n.t;
  bot.context.locale = i18n.changeLanguage;
  // catching errors
  bot.catch(async (error, ctx) => {
    if (!utils.isLocal()) {
      await sendToSentry(ctx, error as Error);
    }
    warn('+++ERROR+++', error);
    if (typeof ctx.callbackQuery !== 'undefined') await ctx.answerCbQuery();

    await ctx.replyWithMarkdownV2(escapeSymbolsMd(ctx.t('errors.general_error')));
  });
  // use stage middleware (scenes)
  bot.use(wrapper('stage', stage.middleware()));
  // latency checking middleware
  bot.use(async (ctx, next) => {
    const start = new Date().getTime();

    return next().then((result) => {
      const ms = new Date().getTime() - start;
      const scene = ctx && ctx.session && ctx.session.__scenes
        ? ctx.session.__scenes.current
        : null;
      info(
        `Response time: ${ms}ms. Current scene: ${scene}`,
        ctx.message,
      );

      return result;
    });
  });
  // listen to global commands/actions/text
  globalListener(bot);
  // use default handler
  bot.use(defaultHandler);
  info('<<< Exiting bot-factory.create()');

  return bot;
};

export default create;
