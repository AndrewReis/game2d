// dependencies
import { Game, Types } from "phaser";

import '/public/assets/style.css';

import { initiateDiscordSDK } from './utils/discordSdk';

// scenes
import { MainScene } from './scenes/MainScene';

// config
import { GameConfig } from './config'

(async () => {
  initiateDiscordSDK();
  const config: Types.Core.GameConfig = {
    ...GameConfig,
    scene: [MainScene]
  };

  new Game(config);
})();