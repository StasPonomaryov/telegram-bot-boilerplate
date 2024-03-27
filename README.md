# Telegram Bot Boilerplate
## Start

- Create Firebase project
- Create Cloud Firestore on `europe-west2` location
- Create Realtime Database and copy URL of it
- In Firebase generate private key: Project Settings - Service Accounts - Generate new private key
- Put the file to `src` folder
- Create `.env` file in `functions` folder and put there  
`FIREBASE_REALTIME_DB_URL="<URL_COPIED EARLIER>"`
### src\env.json
Create file `src\env.json`:
```
{
  "bot": {
    "token": <TOKEN>
  },
  "sentry": {
    "dsn": "<SENTRY_DSN>",
    "environment": "dev"
  }
}
```
### src\local.ts
Create file `src\local.ts` like this:
```
import Bot from './bot';
import * as keys from './env.json';
import * as settings from './config/settings.json';
import { cloudFirestore } from './database';

// Prepare config from settings and keys
const config = {
  keys: {
    ...settings,
    ...keys,
  },
};
// Create bot instance
const bot = Bot(
  config,
  cloudFirestore,
);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```