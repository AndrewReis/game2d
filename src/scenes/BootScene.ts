import 'phaser';

import { ICharacter } from '../types/characters'

import { responsiveScreenHelper } from '../utils/responsive';
import { characters }             from '../utils/fakes';


export class BootScene extends Phaser.Scene {
  // temp
  public characters: ICharacter[];

  constructor() {
    super('Boot');
    // temp
    this.characters = characters;
  }

  preload() {
    responsiveScreenHelper(this);
    this.load.setPath('assets');

    for (const char of this.characters) {
      this.load.atlas(char.key, char.assets.img, char.assets.json);
    }
  }

  create() {
    this.scene.start('Main');
  }
}