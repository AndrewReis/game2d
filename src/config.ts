import 'phaser'

// const GAME_WIDTH  = window.innerWidth * window.devicePixelRatio;
const GAME_WIDTH  = 640;
// const GAME_HEIGHT = window.innerHeight * window.devicePixelRatio;
const GAME_HEIGHT = 960;
const SCALE_RATIO = window.devicePixelRatio / 3;

const ALIGN = {
  centerX: GAME_WIDTH / 2,
  centerY: GAME_HEIGHT / 2,
  center: GAME_WIDTH / 2,
  left: 0 + 70,
  right: GAME_WIDTH - 70,
  top: 0,
  bottom: GAME_HEIGHT - 100,
} 

export {
  GAME_HEIGHT,
  GAME_WIDTH,
  SCALE_RATIO,
  ALIGN
}

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
  dom: {
    createContainer: true,
  },
};