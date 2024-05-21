// dependencies
import 'phaser';
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
  (window as any)._game = new Game(GameConfig);
});
