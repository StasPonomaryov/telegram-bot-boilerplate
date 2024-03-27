/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
// Load .env
dotenv.config();

const firebaseApp = initializeApp({
  databaseURL: process.env.FIREBASE_REALTIME_DB_URL,
});
// Realtime database for sessions
export const realtimeDb = getDatabase(firebaseApp);
// Cloud database for products, points, orders, settings
export const cloudFirestore = getFirestore(firebaseApp);
