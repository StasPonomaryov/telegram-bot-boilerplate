/* eslint-disable import/no-extraneous-dependencies */
import * as i18n from 'i18next';
import { get } from 'lodash';
import * as enFile from '../locale/en/translation.json';
import * as ukFile from '../locale/uk/translation.json';

const resources = {
  en: {
    translation: enFile,
  },
  uk: {
    translation: ukFile,
  },
};
/**
 * Check if bot in production mode
 * @returns {Boolean}
 */
export const isProd = (): boolean => (
  process.env.GCLOUD_PROJECT !== undefined
  && !process.env.GCLOUD_PROJECT.includes('dev')
  && !process.env.GCLOUD_PROJECT.includes('not-a-project')
);
/**
 * Check if bot in test mode
 * @returns {Boolean}
 */
export const isTest = (): boolean => process.env.GCLOUD_PROJECT !== undefined
  && process.env.GCLOUD_PROJECT.includes('not-a-project');
/**
 * Check if bot in local use
 * @returns {Boolean}
 */
export const isLocal = (): boolean => process.env.APPDATA !== undefined;
/**
 * Check if bot in test mode in local use
 * @returns {Boolean}
 */
export const isTestLocal = (): boolean => process.env.GCLOUD_PROJECT === undefined;
/**
 * Escape special symbols for Telegram message with markdown
 * @param stringToEscape
 * @returns
 */
export const escapeSymbolsMd = (stringToEscape: string): string => stringToEscape
  .replace(/_/gi, '\\_')
  .replace(/~/gi, '\\~')
  .replace(/!/gi, '\\!')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\*/g, '\\*')
  .replace(/`/g, '\\`')
  .replace(/\n/g, '\\\n');

export const match = (
  key: i18n.ResourceKey,
) => Object.values(resources).map((v) => get(v.translation, key));
