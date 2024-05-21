// dependencies
import 'phaser';
import './style.css'

// scenes
import { LoginScene } from './scenes/LoginScene';
import { LoadingScene } from './scenes/LoadingScene';
import { HomeScene }  from './scenes/HomeScene';
import { BootScene }  from './scenes/BootScene';

import { GameConfig } from './config'

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    // scenes
    this.scene.add('Login', LoginScene);
    this.scene.add('Loading', LoadingScene);
    this.scene.add('Home', HomeScene);
    this.scene.add('Boot', BootScene);

    // start
    this.scene.start('Login');
  }
}

window.addEventListener('load', () => {
  (window as any)._game = new Game(GameConfig);
});
