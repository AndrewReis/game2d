import 'phaser';

import { ICharacter, ISkill } from '../types/characters'
import { responsiveScreenHelper, useAlign } from '../utils/responsive';
import { Sprite } from '../models/Sprite';

interface ITexts {
  txtHealth: Phaser.GameObjects.Text;
  txtStamina: Phaser.GameObjects.Text;
  txtHealth2: Phaser.GameObjects.Text;
  txtStamina2: Phaser.GameObjects.Text;
}

const styleSkillsBtn = {
  fontFamily: 'Arial',
  fontSize: '32px',
  color: '#ffffff',
  align: 'center',
  fixedWidth: 70,
  fixedHeight: 70,
  backgroundColor: '#2d2d2d'
}

export class MainScene extends Phaser.Scene {
  public sprites: Phaser.GameObjects.Sprite[];
  public currentCharacter: Sprite;
  public skillSelected: ISkill;
  public containerSkills: Phaser.GameObjects.Container;


  public currentTurnOwner: 'player' | 'adversary';
  public currentTurn: number;
  public texts: ITexts;

  // temp
  public characters: ICharacter[];

  constructor() {
    super('Main');
    this.sprites = [];
    this.currentCharacter = {} as Sprite;
    this.skillSelected = {} as ISkill;
    this.containerSkills = {} as Phaser.GameObjects.Container;


    this.currentTurn = 1;
    this.currentTurnOwner = 'player';
    this.texts = {
      txtHealth: {} as Phaser.GameObjects.Text,
      txtStamina: {} as Phaser.GameObjects.Text,
      txtHealth2: {} as Phaser.GameObjects.Text,
      txtStamina2: {} as Phaser.GameObjects.Text,
    }
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
    responsiveScreenHelper(this);
  }

  create() {
    const { centerX, centerY, top } = useAlign();
    this.add.text(centerX - 140, top + 50, 'EM DESENVOLVIMENTO', { fontSize: '24px', fontFamily: 'Arial' });

    const txtNextTurn = this.add.text(centerX, centerY, `Proxímo Turno`, styleSkillsBtn);

    txtNextTurn.setInteractive();
    txtNextTurn.on('pointerdown', () => this.nextTurn());

    for (const character of this.characters) {
      this.drawSprites(character);
    }
  }

  drawSprites(character: ICharacter) {
    const { centerY, left, right } = useAlign();

    const posX = character.owner ? left + 60 : right - 60;
    const sprite = new Sprite(this, character, posX, centerY);

    sprite.on('pointerdown', () => this.selectCharacter(sprite));
    this.sprites.push(sprite);
  }

  selectCharacter(sprite: Sprite) {
    console.log(sprite.data.list.key)
    this.containerSkills = this.add.container(10, 10);
    sprite.showAndSelectSkills(this, this.containerSkills)
    // if (sprite.data.list.owner && !this.skillSelected.name && this.currentTurnOwner === 'player') {
    //   this.containerSkills = this.add.container(10, 10);
    //   sprite.showAndSelectSkills(this, this.containerSkills);

    //   this.events.on('skill_selected', (skill: ISkill) => {
    //     this.currentCharacter = sprite;
    //     this.skillSelected = skill;
    //     this.sprites.forEach(sprite => {
    //       if (sprite.name !== 'isOwner') {
    //         sprite.setTint(0xff0000)
    //       }
    //     });
    //   });
    // } 
    
    // if (!sprite.data.list.owner && this.skillSelected.name && this.currentTurnOwner === 'player') {
    //   this.sprites.forEach(sprite => {
    //     if (sprite.name !== 'isOwner') {
    //       sprite.clearTint()
    //     }
    //   });
    //   this.currentCharacter.applySkill(this, this.skillSelected, sprite);
    // }
  }

  nextTurn() {
    this.currentTurn++
    this.currentTurnOwner = this.currentTurnOwner === 'player' ? 'adversary' : 'player';

    if (this.currentTurnOwner === 'adversary') {
      this.skillSelected = {} as ISkill;
      this.containerSkills.destroy();
      this.sprites.forEach(sprite => {
        if (sprite.name !== 'isOwner') {
          this.currentCharacter = sprite.data.list as Sprite;
        }
      });
    }
  }

  update(): void {
    this.events.on('next_turn', () => this.nextTurn());
  }
}