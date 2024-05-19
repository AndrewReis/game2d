import 'phaser';
import { Socket, io } from "socket.io-client";


import { responsiveScreenHelper } from '../helpers/responsive-helper';

import { database, ICharacter } from '../database'

interface ITexts {
  txtCurrentTurn: Phaser.GameObjects.Text;
  txtCurrentTurnOwner: Phaser.GameObjects.Text;
  txtSkillSelected: Phaser.GameObjects.Text;
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

export class BootScene extends Phaser.Scene {
  public sprites: ISprites[];
  public currentCharacter: ICharacter;
  public isSelectedSkill: boolean;
  public containerSkills: Phaser.GameObjects.Container;
  public currentTurnOwner: 'player' | 'adversary';
  public currentTurn: number;
  private socket: Socket;
  public texts: ITexts;

  constructor() {
    super('Boot');
    this.sprites = [];
    this.currentCharacter = {} as ICharacter;
    this.isSelectedSkill = false;
    this.currentTurn = 1;
    this.currentTurnOwner = 'adversary';
    this.containerSkills = {} as Phaser.GameObjects.Container;
    this.texts = {
      txtCurrentTurn: {} as Phaser.GameObjects.Text,
      txtCurrentTurnOwner: {} as Phaser.GameObjects.Text,
      txtSkillSelected: {} as Phaser.GameObjects.Text
    }

    this.socket = io('http://localhost:3333', {
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected!', this.socket.id);
    });
  }

  preload() {
    for (const character of database.characters) {
      this.load.atlas(character.key, character.assets.img, character.assets.json);
    }

    // this.load.on('filecomplete-atlas', (key: string) => {
    //   console.log(`Atlas loaded: ${key}`);
    // });

    // this.load.on('loaderror', (file: any) => {
    //   console.error(`Error loading file: ${file.key}`);
    // });

    // this.load.on('complete', () => {
    //   console.log('All assets loaded');
    // });

    responsiveScreenHelper(this);
  }

  create() {
    for (const character of database.characters) {
      for (const anim of character.anims) {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNames(character.key, { prefix: anim.prefix, suffix: anim.suffix, end: anim.end, zeroPad: anim.zeroPad }),
          repeat: anim.repeat,
          frameRate: anim.frameRate
        });
      }
    }

    for (const character of database.characters) {
      const sprite = this.add.sprite(100, 100, character.key);
      const animIdle = character.anims.find(c => c.key.includes('idle_'));

      sprite.setInteractive();
      sprite.flipX = !character.owner;
      sprite.play(animIdle!.key);
      sprite.setScale(2);
      sprite.setPosition(character.position.x, character.position.y);

      sprite.on('pointerdown', () => this.selectCharacter(character));

      const item: ISprites = {} as ISprites;
      Object.assign(item, { ...sprite, character });

      this.sprites.push(item);
    }

    if (this.currentTurnOwner === 'player') {
      this.sprites.forEach(sprite => {
        if (sprite.character.owner) {
          this.showSkills(sprite.character); // TODO ajustar quando tiver mais de um char.
        }
      });
    }

    this.input.keyboard.on('keydown-T', this.nextTurn, this);

    this.texts.txtCurrentTurnOwner = this.add.text(20, 550, `Turno do: ${this.currentTurnOwner}`)
    this.texts.txtCurrentTurn = this.add.text(20, 600, `Turno atual: ${this.currentTurn}`)
    this.texts.txtSkillSelected = this.add.text(20, 650, `Escolha uma Skill`)
  }

  selectCharacter(character: ICharacter) {
    if (character.owner && !this.isSelectedSkill) {
      console.log('É seu personagem')
      this.showSkills(character);
      return;
    } else if (!character.owner && this.isSelectedSkill) {
      this.applySkill(character);
      return;
    } else if (character.owner && this.isSelectedSkill) {
      console.log('Escolha seu ALVO!');
      return;
    }

    console.log('NÃO é seu personagem', character.key)
  }

  showSkills(character: ICharacter) {
    if (this.currentTurnOwner === 'player' && character.owner) {
      this.containerSkills = this.add.container(10, 10);
      console.log(this.currentTurnOwner)
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
          this.isSelectedSkill = character.owner;
          if (this.isSelectedSkill) {
            this.texts.txtSkillSelected.setText(`Skill selecionada: ${this.currentCharacter.skillSelected?.name}`);
            this.currentCharacter.skillSelected = skill;
          }
        });
      });
    }
  }

  applySkill(target: ICharacter) {
    if (!this.currentCharacter.skillSelected) return; // TODO remover

    if (this.currentCharacter.energy >= this.currentCharacter.skillSelected.cost) {
      console.log('SERVER ACTION');
      this.nextTurn();
      return;
    }

    console.log('Sem energia para executar essa skill');
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

    this.texts.txtCurrentTurn.setText(String(`Turno atual: ${this.currentTurn}`));
    this.texts.txtCurrentTurnOwner.setText(`Turno do: ${this.currentTurnOwner}`);
    this.texts.txtSkillSelected.setText(`Skill selecionada: ${this.currentCharacter.skillSelected?.name}`);
  }
}