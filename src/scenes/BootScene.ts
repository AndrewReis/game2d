import 'phaser';

// import { responsiveScreenHelper } from '../utils/responsive';


export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // responsiveScreenHelper(this);
  }

  create() {
    this.scene.start('Main');
  }
}