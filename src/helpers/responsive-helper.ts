import 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

const _updateCamera = (scene: Phaser.Scene, parent: Phaser.Structs.Size, sizer: Phaser.Structs.Size) => {
  const camera = scene.cameras.main;
  const x = Math.ceil((parent.width - sizer.width) * 0.5);
  const y = 0;
  const scaleX = sizer.width / GAME_WIDTH;
  const scaleY = sizer.height / GAME_HEIGHT;

  camera.setViewport(x, y, sizer.width, sizer.height);
  camera.setZoom(Math.max(scaleX, scaleY));
  camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);
}

export const responsiveScreenHelper = (scene: Phaser.Scene) => {
  const parent = new Phaser.Structs.Size(scene.scale.gameSize.width, scene.scale.gameSize.height);
  const sizer = new Phaser.Structs.Size(GAME_WIDTH, GAME_HEIGHT, Phaser.Structs.Size.FIT, parent);

  parent.setSize(scene.scale.gameSize.width, scene.scale.gameSize.height);
  sizer.setSize(scene.scale.gameSize.width, scene.scale.gameSize.height);

  _updateCamera(scene, parent, sizer);

  scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT).setStrokeStyle(1, 0xfffff);
}