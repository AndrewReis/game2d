import 'phaser';
import { responsiveScreenHelper } from '../helpers/responsive-helper';

export class HomeScene extends Phaser.Scene {
  constructor() {
    super('Home');
  }

  preload() {
    responsiveScreenHelper(this);
  }

  create() {
    this.add.text(10, 10, 'Home', { color: 'white', fontFamily: 'Arial', fontSize: '32px ' });
  }
}
