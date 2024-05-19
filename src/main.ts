// dependencies
import 'phaser';
import './style.css'

// scenes
import { BootScene }      from './scenes/BootScene';

import { GameConfig } from './config'

export class Game extends Phaser.Game {
  // private wsConnection: WSConnection;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    // scenes
    this.scene.add('Boot', BootScene);

    // start
    this.scene.start('Boot');
  }
}

window.addEventListener('load', () => {
  (window as any)._game = new Game(GameConfig);
});
