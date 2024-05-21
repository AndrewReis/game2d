import 'phaser';
import { responsiveScreenHelper } from '../helpers/responsive-helper';
import { api } from '../services/axios';
import { setAllChars } from '../services/storage';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('Loading');
  }

  preload() {
    responsiveScreenHelper(this);
  }

  async create() {
    this.add.text(10, 10, 'Loading', { color: 'white', fontFamily: 'Arial', fontSize: '32px ' });
    
    try {
      const response = await api.get('/characters');
      setAllChars(response.data);
      this.scene.start('Home');
    } catch (error) {
      console.error(error);
    }
  }
}
