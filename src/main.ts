// dependencies
import { Game, Types } from "phaser";

import '/public/assets/style.css';

import { initiateDiscordSDK } from './utils/discordSdk';

// scenes
import { BootScene } from './scenes/BootScene';
import { MainScene } from './scenes/MainScene';

// config
import { GameConfig } from './config'

(async () => {
  initiateDiscordSDK();
  const config: Types.Core.GameConfig = {
    ...GameConfig,
    scene: [BootScene, MainScene]
  };

  new Game(config);
})();