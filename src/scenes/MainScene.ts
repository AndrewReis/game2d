import 'phaser';

import { ICharacter, ISkill } from '../types/characters'
import { Sprite }             from '../models/Sprite';

import { responsiveScreenHelper, useAlign } from '../utils/responsive';
import { characters }                       from '../utils/fakes';

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

    // temp
    const { centerX, centerY } = useAlign();

    this.characters = characters.map((char, index) => {
      let x = 0;
      let y = 0;

      if (char.owner) {
        x = centerX - 140;
        y = centerY - 180 * (index - 1);
      } else {
        x = centerX + 140;
        y = centerY - 180 * (index - 3) + 180;
      }

      return {
        ...char,
        position: { x, y }
      }
    });
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
    const sprite = new Sprite(this, character);

    sprite.on('pointerdown', () => this.selectCharacter(sprite));
    this.sprites.push(sprite);
  }

  selectCharacter(sprite: Sprite) {
    console.log(sprite.data.list.key)
    this.containerSkills = this.add.container(10, 10);
    sprite.showAndSelectSkills(this, this.containerSkills)
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