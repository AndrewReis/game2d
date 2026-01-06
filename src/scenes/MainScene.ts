import 'phaser';

class CartesianPlane {
  private scene: Phaser.Scene;
  private width: number
  private height: number
  private tileSize: number

  constructor(scene: Phaser.Scene, width: number, height: number, tileSize: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
  }

  toWorld(x: number, y: number) {
    return {
      x: x * this.tileSize,
      y: y * this.tileSize
    };
  }

  drawPlane() {
    const graphics = this.scene.add.graphics();
    graphics.clear();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = this.toWorld(x, y);

        // Tile
        graphics.lineStyle(1, 0xffffff, 1);
        graphics.strokeRect(pos.x, pos.y, this.tileSize, this.tileSize);

        // Coordenadas
        this.scene.add.text(pos.x + 2, pos.y + 2, `${x},${y}`, {
          fontSize: '10px',
          color: '#ffffff'
        });
      }
    }
  }
}

const TILE_SIZE = 32;
const MAP_WIDTH = 128;
const MAP_HEIGHT = 128;

export class MainScene extends Phaser.Scene {
  private globalWorld: CartesianPlane;

  constructor() {
    super('Main');
    this.globalWorld = {} as CartesianPlane;
  }

  create() {
    this.globalWorld = new CartesianPlane(this, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE);

    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    this.globalWorld.drawPlane();
  }
}
