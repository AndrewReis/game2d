import 'phaser'

// // const GAME_WIDTH  = window.innerWidth * window.devicePixelRatio;
// const GAME_WIDTH = 640;
// // const GAME_HEIGHT = window.innerHeight * window.devicePixelRatio;
// const GAME_HEIGHT = 960;
// const SCALE_RATIO = window.devicePixelRatio / 3;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'phaser-example',
    width: 640,
    height: 960,
    min: {
      width: 320,
      height: 480
    },
    max: {
      width: 1400,
      height: 1200
    }
  },
  callbacks: {
    postBoot: function (game) {
      const canvas = game.canvas;
      const context = canvas.getContext('2d', { willReadFrequently: true });
    }
  }
};