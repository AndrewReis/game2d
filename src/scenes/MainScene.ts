import 'phaser';

import { IActions, ICharacter, ISkill } from '../types/characters'
import { Sprite }             from '../models/Sprite';

import { responsiveScreenHelper, useAlign } from '../utils/responsive';
import { characters }                       from '../utils/fakes';


export class MainScene extends Phaser.Scene {
  public sprites: Phaser.GameObjects.Sprite[];
  public currentCharacter: Sprite;
  public containerSkills: Phaser.GameObjects.Container;
  public playerActions: IActions;
  public waitingTargetSelect: boolean;

  public currentTurnOwner: 'player' | 'adversary';
  public currentTurn: number;

  // temp
  public characters: ICharacter[];

  constructor() {
    super('Main');
    this.sprites = [];
    this.currentCharacter = {} as Sprite;
    this.containerSkills = {} as Phaser.GameObjects.Container;

    this.waitingTargetSelect = false;
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
    const { centerX, top } = useAlign();
    this.add.text(centerX - 140, top + 50, 'EM DESENVOLVIMENTO', { fontSize: '24px', fontFamily: 'Arial' });

    for (const character of this.characters) {
      this.drawSprites(character);
    }

    this.events.on('skill_selected', (event: ISkill) => this.handleSkillSelected(event));
  }

  drawSprites(character: ICharacter) {
    const sprite = new Sprite(this, character);
    sprite.on('pointerdown', () => this.selectCharacter(sprite));
    this.sprites.push(sprite);
  }

  selectCharacter(sprite: Sprite) {
    console.log(this.waitingTargetSelect)
    if (Object.keys(this.containerSkills).length) this.containerSkills.destroy();

    if (!sprite.data.list.owner && this.waitingTargetSelect) {
      console.log('esse é meu alvo');
      return;
    }

    if (sprite.data.list.owner) {
      this.waitingTargetSelect = false;

      this.sprites.forEach(sprite => {
        if (!sprite.data.list.owner) {
          sprite.clearTint()
        }
      });
      
      this.containerSkills = this.add.container(10, 10);
      sprite.showSkills(this, this.containerSkills)
      return
    }
  }

  handleSkillSelected(skill: ISkill) {
    if (skill.target !== 'self') {
      this.sprites.forEach(sprite => {
        if (!sprite.data.list.owner) {
          sprite.setTint(0xff7373)
        }
      });

      this.waitingTargetSelect = true;
    }
  }

  nextTurn() {
    this.currentTurn++
    this.currentTurnOwner = this.currentTurnOwner === 'player' ? 'adversary' : 'player';

    if (this.currentTurnOwner === 'adversary') {
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