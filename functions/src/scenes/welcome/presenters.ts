// eslint-disable-next-line import/no-extraneous-dependencies
import { debug } from 'firebase-functions/logger';
import { CustomContext } from '../../types';
import BotError from '../../utils/botError';

const SceneEnter = (ctx: CustomContext) => {
  debug('>>>SESSION', ctx.session);
  if (!ctx.session) {
    throw new BotError('No session found', 'noSession');
  }
  const message = ctx.t('hello');

  return ctx.reply(message);
};

export default SceneEnter;
