import 'phaser';

import { ICharacter } from '../types/characters'

export class BootScene extends Phaser.Scene {
  // temp
  public characters: ICharacter[];

  constructor() {
    super('Boot');
    // temp
    this.characters = [
      {
        key: 'char11',
        assets: {
          img: 'chars/char11.png',
          json: 'chars/char11.json'
        },
        anims: [
          {
            key: 'idle_char11',
            repeat: -1,
            prefix: 'idle_',
            suffix: '.png',
            end: 4,
            zeroPad: 0,
            frameRate: 10
          }
        ],
        position: { x: 100, y: 400 },
        health: 100,
        energy: 100,
        owner: true,
        skills: [
          { name: 'Ataque', damage: 50, cost: 30 },
          { name: 'Recarregar', damage: 0, cost: 0 },
        ]
      },
      {
        key: 'char14',
        assets: {
          img: 'chars/char14.png',
          json: 'chars/char14.json'
        },
        anims: [
          {
            key: 'idle_char14',
            repeat: -1,
            prefix: 'idle_',
            suffix: '.png',
            end: 5,
            zeroPad: 0,
            frameRate: 10
          }
        ],
        position: { x: 500, y: 400 },
        health: 100,
        energy: 100,
        owner: false,
        skills: [
          { name: 'Ataque comum', damage: 50, cost: 30 },
        ]
      }
    ];
  }

  preload() {
    this.load.setPath('assets');

    for (const char of this.characters) {
      this.load.atlas(char.key, char.assets.img, char.assets.json);
    }
  }

  create() {
    this.scene.start('Main');
  }
}