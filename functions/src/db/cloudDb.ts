import { DocumentData, Firestore } from 'firebase-admin/firestore';
import BotError from '../utils/botError';

/**
 * Database class
 */
class CloudDb {
  cloudDb: Firestore;

  configCollection: string;

  settingsDoc: string;

  constructor(database: Firestore) {
    this.cloudDb = database;
    this.configCollection = 'config';
    this.settingsDoc = 'settings';
  }

  /**
   * Get settings from DB
   * @returns {Promise} settings data
   */
  async getSettings(): Promise<DocumentData | undefined> {
    const snapshot = await this.cloudDb
      .collection(this.configCollection)
      .doc(this.settingsDoc)
      .get();

    if (snapshot.exists) {
      return snapshot.data();
    }

    throw new BotError('noSettings', 'No settings data');
  }
}

export default CloudDb;
