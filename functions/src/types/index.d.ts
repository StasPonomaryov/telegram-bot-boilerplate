import type { Context, Scenes } from 'telegraf';
import type { TFunction, Callback } from 'i18next';
import type CloudDb from '../db/cloudDb';

export interface BotMainConfig {
  bot: {
    token: string;
  };
  sentry?: {
    dsn: string;
    environment: string;
  };
  ga?: {
    tid: string;
  };
}

export interface BotSettings {
  default_language: string;
}

export interface MySession extends Scenes.SceneSession {
  __language_code?: string;
  user?: {
    id?: number | string;
    first_name?: string;
  };
}

export interface Keys {
  keys: BotSettings & BotMainConfig;
}

export interface CustomContext extends Context {
  session: MySession;
  keys: BotSettings & BotMainConfig;
  t: TFunction<string[], string[]>;
  locale: (lng?: string | undefined, callback?: Callback | undefined) => Promise<TFunction<'translation', 'translation'>>;
  configDB: CloudDb;
  scene: Scenes.SceneContextScene<CustomContext>;
}
