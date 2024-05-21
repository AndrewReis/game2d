// dependencies
import 'phaser';

import { initiateDiscordSDK } from './utils/discordSdk';

import './style.css'

// scenes
import { MainScene }  from './scenes/MainScene';

import { GameConfig } from './config'

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    // scenes
    this.scene.add('Main', MainScene);

    // start
    this.scene.start('Main');
  }
}

window.addEventListener('load', () => {
  initiateDiscordSDK();
  (window as any)._game = new Game(GameConfig);
});
