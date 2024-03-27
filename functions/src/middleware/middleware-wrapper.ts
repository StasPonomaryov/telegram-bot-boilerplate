/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/ban-types */
import { logger } from 'firebase-functions';
import { Middleware } from 'telegraf';
import { CustomContext } from '../types';

type TSomeFunc = () => PromiseLike<unknown>;

function nextWrapper(name: string, fn: Function) {
  return function (this: Function, ...args: unknown[]) {
    logger.debug(`<<<<< end middleware ${name}`);
    return fn.apply(this, args);
  };
}

export default function wrapper(name: string, fn: Function) {
  return function (this: Middleware<CustomContext>, ctx: { session: unknown }, next: TSomeFunc) {
    logger.debug(`>>>>> start middleware ${name}`, ctx.session);
    return fn.apply(this, [ctx, nextWrapper(name, next)]);
  };
}
