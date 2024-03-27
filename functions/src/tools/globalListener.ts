/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Scenes, Telegraf } from 'telegraf';
import { CustomContext } from '../types';

const globalListener = (instance: Telegraf<CustomContext> | Scenes.BaseScene<CustomContext>) => {
  // Start/restart bot
  instance.start(async (ctx: CustomContext) => {
    const { update } = ctx;
    if ('message' in update) {
      const { id, first_name } = update.message.from;
      ctx.session = {
        ...ctx.session,
        user: {
          id,
          first_name,
        },
      };
    }
    const defaultLocale = ctx.keys.default_language || 'uk';

    await ctx.locale(defaultLocale);
    ctx.session.__language_code = defaultLocale;

    return ctx.scene.enter('welcome');
  });
  // Change locale to EN
  instance.command('en', async (ctx) => {
    await ctx.locale('en');
    ctx.session.__language_code = 'en';

    return ctx.scene.enter('welcome');
  });
  // Change locale to UK
  instance.command('uk', async (ctx) => {
    await ctx.locale('uk');
    ctx.session.__language_code = 'uk';

    return ctx.scene.enter('welcome');
  });
};

export default globalListener;
