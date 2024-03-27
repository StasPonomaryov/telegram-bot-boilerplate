/* eslint-disable @typescript-eslint/no-var-requires */
// import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import { isLocal } from '../utils';
import CloudDb from '../db/cloudDb';
import * as fromFile from '../config/settings.json';
import { BotSettings } from '../types';

require('dotenv').config();

export default (db: Firestore) => ({
  /**
   * Get settings from database
   * @returns {object} settings
   */
  async getFromDB() {
    const defaults = this.getFromFile();
    let result: BotSettings = defaults;
    const cloud = new CloudDb(db);
    const cloudSettings = await cloud.getSettings() as BotSettings;
    if (cloudSettings
      && !isLocal()) result = cloudSettings;

    return result;
  },
  /**
   * Get default settings
   * @returns {object} settings
   */
  getFromFile() {
    return fromFile;
  },
});
