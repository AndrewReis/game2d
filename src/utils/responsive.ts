const _updateCamera = (scene: Phaser.Scene, parent: Phaser.Structs.Size, sizer: Phaser.Structs.Size, canvas: HTMLCanvasElement) => {
  const camera = scene.cameras.main;
  const x = Math.ceil((parent.width - sizer.width) * 0.5);
  const y = 0;
  const scaleX = sizer.width / canvas.width;
  const scaleY = sizer.height / canvas.height;

  camera.setViewport(x, y, sizer.width, sizer.height);
  camera.setZoom(Math.max(scaleX, scaleY));
  camera.centerOn(canvas.width / 2, canvas.height / 2);
}

export const responsiveScreenHelper = (scene: Phaser.Scene) => {
  const canvas = document.querySelector('canvas');

  if (!canvas) return new Error('Canvas not loaded');

  const parent = new Phaser.Structs.Size(scene.scale.gameSize.width, scene.scale.gameSize.height);
  const sizer = new Phaser.Structs.Size(canvas?.width, canvas?.height, Phaser.Structs.Size.FIT, parent);

  parent.setSize(scene.scale.gameSize.width, scene.scale.gameSize.height);
  sizer.setSize(scene.scale.gameSize.width, scene.scale.gameSize.height);

  _updateCamera(scene, parent, sizer, canvas);
  scene.add.rectangle(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height).setStrokeStyle(5, 0xfffff);
}

export function useAlign() {
  const canvas = document.querySelector('canvas');

  const aligns = {
    centerX: 0,
    centerY: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }

  if (canvas) {
    aligns.centerX = canvas.width / 2
    aligns.centerY = canvas.height / 2
    aligns.top = 0
    aligns.bottom = canvas.height - 10
    aligns.left = 0 + 10
    aligns.right = canvas.width - 10
  }

  return aligns;
}