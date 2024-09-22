# Telegram Bot Boilerplate
## Start

- Create Firebase project
- Create Cloud Firestore on `europe-west2` location
- Create Realtime Database and copy URL of it
- In Firebase generate private key: Project Settings - Service Accounts - Generate new private key
- Put the file to `src` folder
- Create `.env` file in `functions` folder and put there  
`FIREBASE_REALTIME_DB_URL="<URL_COPIED EARLIER>"`
- Generate your file with private key: in Firebase console go to Project overview -> Project settings -> Add app (Web app). Then in Service account tab click on Generate new private key. Download file to your `src` folder and add it to `.gitignore` file.

### src\local.ts
Create file `src\local.ts` like this:
```
import Bot from './bot';
import * as settings from './config/settings.json';
import { cloudFirestore } from './database';

process.env.GOOGLE_APPLICATION_CREDENTIALS = './src/<YOUR_FILE_WITH_PRIVATE_KEY>';

const keys = {
  bot: {
    token: process.env.BOT_TOKEN || '',
  },
  default_language: 'en',
};
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

## Service account permissions
1. In Firebase console go to Project overview -> Project settings. Click on 'Manage service account permissions' link
2. Click on 'Create service account'
3. In 'Grant this service account access to project' step add this roles:  
- Service Account User,  
- Artifact Registry Repository Administrator,  
- Cloud RuntimeConfig Admin,  
- Firebase Authentication Viewer,  
- Cloud Functions Admin,  
- Cloud Scheduler Admin (only if using scheduled functions),  
- Pub/Sub Editor (only if using 2nd gen pubsub onMessagePublished)
4. Skip the third step to add user access to this service account and simply click on “Done” to finish.
5. Back in the list of service accounts, click on the account you just created. And in the Account’s settings select the Keys view where you click on “Add Key” and then “Create New Key”. Make sure the Key type is JSON, then click “Create”. A JSON key file is automatically downloaded to your computer and this is the file that we need to use in the CI.

## Github actions
1. Add REALTIME_DB_URL secret copying URL from FIREBASE_REALTIME_DB_URL of your `.env` file
2. Add the content of your JSON key file as REALTIME_DB_URL secret