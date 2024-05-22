import 'phaser';

import { ICharacter } from '../types/characters'
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
  public currentCharacter: ICharacter;
  public isSelectedSkill: boolean;
  public containerSkills: Phaser.GameObjects.Container;
  public currentTurnOwner: 'player' | 'adversary';
  public currentTurn: number;
  public texts: ITexts;

  // temp
  public characters: ICharacter[];

  constructor() {
    super('Main');
    this.sprites = [];
    this.currentCharacter = {} as ICharacter;
    this.isSelectedSkill = false;
    this.currentTurn = 1;
    this.currentTurnOwner = 'adversary';
    this.containerSkills = {} as Phaser.GameObjects.Container;
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

    if (this.currentTurnOwner === 'player') {
      this.sprites.forEach(sprite => {
        if (sprite.name === 'isOwner') {
          this.showSkills((sprite.data.list as ICharacter)); // TODO ajustar quando tiver mais de um char.
        }
      });
    } else {
      this.nextTurn();
    }
  }

  selectCharacter(character: ICharacter) {
    if (character.owner && !this.isSelectedSkill) {
      this.showSkills(character);
      return;
    } else if (!character.owner && this.isSelectedSkill) {
      this.applySkill(character);
      return;
    } else if (character.owner && this.isSelectedSkill) {
      console.log('Escolha seu ALVO!');
      return;
    }
  }

  showSkills(character: ICharacter) {
    const { centerX, centerY, bottom, top } = useAlign();

    if (this.currentTurnOwner === 'player' && character.owner) {
      this.containerSkills = this.add.container(centerX, 10);

      character.skills.forEach((skill, index) => {
        const text = this.add.text(
          centerX,
          10,
          `${skill.name}`,
          styleSkillsBtn
        );

        this.containerSkills.add(text);

        this.currentCharacter = character;
        text.setInteractive();
        text.on('pointerdown', () => {
          if (skill.name === 'Recarregar') {
            this.currentCharacter.skillSelected = skill;
            this.applySkill(this.currentCharacter);
            return
          }

          this.isSelectedSkill = character.owner;
          if (this.isSelectedSkill) {
            this.sprites.forEach(sprite => {
              if (sprite.name !== 'isOwner') {
                sprite.setTint(0xff0000)
              }
            });
            this.currentCharacter.skillSelected = skill;
          }
        });
      });
    }
  }

  applySkill(target: ICharacter) {
    if (this.currentCharacter.skillSelected) {
      if (this.currentCharacter.skillSelected.name === 'Recarregar') {
        this.characters.forEach(char => {
          if (char.key === this.currentCharacter.key) {
            char.energy += 20;
          }
        })
        this.nextTurn();
        return;
      }

      if (this.currentCharacter.energy >= this.currentCharacter.skillSelected.cost) {
        this.characters.forEach(char => {
          if (char.key === this.currentCharacter.key) {
            char.energy -= this.currentCharacter.skillSelected!.cost;
            target.health -= this.currentCharacter.skillSelected!.damage;
          }
        });

        this.nextTurn();
        return;
      }
    }
    console.log('ERRO! applySkill to: ', this.currentCharacter, target);
  }

  nextTurn() {
    this.currentTurn++
    this.isSelectedSkill = false;
    this.currentTurnOwner = this.currentTurnOwner === 'player' ? 'adversary' : 'player';

    if (this.currentTurnOwner === 'player') {
      this.sprites.forEach(sprite => {
        if (sprite.name === 'isOwner') {
          this.showSkills((sprite.data.list as ICharacter)); // TODO ajustar quando tiver mais de um char.
        }
      });
    } else {
      this.containerSkills.destroy();
      this.sprites.forEach(sprite => {
        if (sprite.name !== 'isOwner') {
          sprite.clearTint();
          this.currentCharacter = sprite.data.list as ICharacter;
        }
      });
    }
  }

  drawSprites(character: ICharacter) {
    const { centerY, left, right } = useAlign();

    const posX   = character.owner ? left + 60 : right - 60;
    const sprite = new Sprite(this, character, posX, centerY);

    sprite.on('pointerdown', () => this.selectCharacter(character));
    this.sprites.push(sprite);
  }
}