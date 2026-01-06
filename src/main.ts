// dependencies
import { Game, Types } from "phaser";

import '/public/assets/style.css';

// scenes
import { BootScene } from './scenes/BootScene';
import { MainScene } from './scenes/MainScene';

// config
import { GameConfig } from './config'

(async () => {
  const config: Types.Core.GameConfig = {
    ...GameConfig,
    scene: [BootScene, MainScene]
  };

  new Game(config);
})();