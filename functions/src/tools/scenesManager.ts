// eslint-disable-next-line import/no-extraneous-dependencies
import { Scenes } from 'telegraf';
import welcomeScene from '../scenes/welcome';
import { CustomContext } from '../types';

const stage = new Scenes.Stage<CustomContext>([
  welcomeScene,
]);

export default stage;
