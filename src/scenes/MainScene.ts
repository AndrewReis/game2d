import 'phaser';

import { responsiveScreenHelper } from '../helpers/responsive-helper';

import { ICharacter } from '../types/characters'
import { ALIGN } from '../config';

interface ITexts {
  txtHealth: Phaser.GameObjects.Text;
  txtStamina: Phaser.GameObjects.Text;
  txtHealth2: Phaser.GameObjects.Text;
  txtStamina2: Phaser.GameObjects.Text;
}

interface ISprites extends Phaser.GameObjects.Sprite {
  character: ICharacter;
}

const styleSkillsBtn = {
  fontFamily: 'Arial',
  fontSize: '32px',
  color: '#ffffff',
  align: 'center',
  fixedWidth: 500,
  backgroundColor: '#2d2d2d'
}

export class MainScene extends Phaser.Scene {
  public sprites: ISprites[];
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
          img: 'src/assets/chars/char11.png',
          json: 'src/assets/chars/char11.json'
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
          { name: 'Ataque',  damage: 50, cost: 30 },
          { name: 'Recarregar',  damage: 0, cost: 0 },
        ]
      },
      {
        key: 'char14',
        assets: {
          img: 'src/assets/chars/char14.png',
          json: 'src/assets/chars/char14.json'
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

    for (const char of this.characters) {
      this.load.atlas(char.key, char.assets.img, char.assets.json);
    }
  }

  create() {
    const txtNextTurn = this.add.text(ALIGN.centerX - 200, ALIGN.centerY + 200, `Proxímo Turno`, styleSkillsBtn);

    txtNextTurn.setInteractive();
    txtNextTurn.on('pointerdown', () => this.nextTurn());

    for (const character of this.characters) {
      for (const anim of character.anims) {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNames(character.key, { prefix: anim.prefix, suffix: anim.suffix, end: anim.end, zeroPad: anim.zeroPad }),
          repeat: anim.repeat,
          frameRate: anim.frameRate
        });
      }

      const sprite = this.add.sprite(100, 100, character.key);
      const animIdle = character.anims.find(c => c.key.includes('idle_'));

      sprite.setInteractive();
      sprite.flipX = !character.owner;
      sprite.play(animIdle!.key);
      sprite.setScale(2);
      sprite.setPosition(ALIGN.centerX + (character.position.x - 250), ALIGN.centerY);

      sprite.on('pointerdown', () => this.selectCharacter(character));

      const item: ISprites = {} as ISprites;
      Object.assign(item, { ...sprite, character });

      this.sprites.push(item);

      if (character.owner) {
        this.texts.txtHealth = this.add.text(sprite.x - 40, sprite.y - 120, `Vida: ${character.health}`);
        this.texts.txtStamina = this.add.text(sprite.x - 40, sprite.y - 100, `Energia: ${character.energy}`);
      } else {
        this.texts.txtHealth2 = this.add.text(sprite.x - 40, sprite.y - 125, `Vida: ${character.health}`);
        this.texts.txtStamina2 = this.add.text(sprite.x - 40, sprite.y - 100, `Energia: ${character.energy}`);
      }
    }

    if (this.currentTurnOwner === 'player') {
      this.sprites.forEach(sprite => {
        if (sprite.character.owner) {
          this.showSkills(sprite.character); // TODO ajustar quando tiver mais de um char.
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
    if (this.currentTurnOwner === 'player' && character.owner) {
      this.containerSkills = this.add.container(ALIGN.centerX - 250, ALIGN.centerY);

      character.skills.forEach((skill, index) => {
        const text = this.add.text(
          50,
          100 + (50 * index),
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
        if (sprite.character.owner) {
          this.showSkills(sprite.character); // TODO ajustar quando tiver mais de um char.
        }
      });
    } else {
      this.containerSkills.destroy();
      this.sprites.forEach(sprite => {
        if (!sprite.character.owner) {
          this.currentCharacter = sprite.character;
        }
      });
    }

    for (const char of this.characters) {
      if (char.owner) {
        this.texts.txtHealth.setText(`Vida: ${char.health}`);
        this.texts.txtStamina.setText(`Energia: ${char.energy}`);
      } else {
        this.texts.txtHealth2.setText(`Vida: ${char.health}`);
        this.texts.txtStamina2.setText(`Energia: ${char.energy}`);
      }
    }
  }
}