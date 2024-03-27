// eslint-disable-next-line import/no-extraneous-dependencies
import { Scenes } from 'telegraf';
import { CustomContext } from '../../types';
import globalListener from '../../tools/globalListener';
import SceneEnter from './presenters';

const welcomeScene = new Scenes.BaseScene<CustomContext>('welcome');
// User entered scene
welcomeScene.enter(SceneEnter);
// Listen to global commands, menu buttons and phrases
globalListener(welcomeScene);

export default welcomeScene;
