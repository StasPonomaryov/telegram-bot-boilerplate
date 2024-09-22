/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { isProd } from './utils';
// Load .env
dotenv.config();
const target = isProd() ? 'prod' : 'dev';

const projectId = process.env.PROJECT_ID ?? `ganjaseeds-${target}`;
const databaseURL = process.env.REALTIME_DB_URL ?? `https://ganjaseeds-${target}-default-rtdb.europe-west1.firebasedatabase.app`;
const firebaseApp = initializeApp({
  projectId,
  databaseURL,
});
// Realtime database for sessions
export const realtimeDb = getDatabase(firebaseApp);
// Cloud database for products, points, orders, settings
export const cloudFirestore = getFirestore(firebaseApp);
