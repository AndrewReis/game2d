import 'phaser';
import { ICharacter, ISkill } from '../types/characters';
import { useAlign } from '../utils/responsive';

class HealthBar {
  private graphic: Phaser.GameObjects.Graphics;
  private value: number;
  private x: number;
  private y: number;
  private p: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.graphic = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 76 / 100;

    this.draw();
    scene.add.existing(this.graphic);
  }

  decrease(amount: number) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();
    return (this.value === 0);
  }

  draw() {
    this.graphic.clear();

    //  BG
    this.graphic.fillStyle(0x000000);
    this.graphic.fillRect(this.x, this.y, 80, 16);

    //  Health
    this.graphic.fillStyle(0xffffff);
    this.graphic.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 30) {
      this.graphic.fillStyle(0xff0000);
    }
    else {
      this.graphic.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);
    this.graphic.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}

export class Sprite extends Phaser.GameObjects.Sprite {
  private hp: HealthBar;

  constructor(scene: Phaser.Scene, character: ICharacter) {
    super(scene, character.position.x, character.position.y, character.key);

    this.createAnimations(scene, character);

    this.setInteractive();
    this.setScale(2);
    this.setName(character.owner ? "isOwner" : "");
    this.setData(character);
    this.flipX = !character.owner;
    this.hp = new HealthBar(scene, this.x - 40, this.y - 100);

    const animIdle = character.anims.find(c => c.key.includes('idle_'));
    this.play(animIdle!.key);

    scene.add.existing(this);
  }

  private damage(amount: number) {
    this.data.list.health -= amount;
    this.hp.decrease(this.data.list.health);
  }

  public applySkill(scene: Phaser.Scene, skill: ISkill, target: Sprite) {
    if (this.data.list.energy >= skill.cost) {
      target.damage(skill.damage);
      scene.events.emit('next_turn');
      return;
    }

    console.log('SEM ENERGIA', this.data.list.energy)
  }

  public showAndSelectSkills(scene: Phaser.Scene, containerSkills: Phaser.GameObjects.Container) {
    const { centerX, bottom } = useAlign();

    this.data.list.skills.forEach((skill: { name: string; }, index: number) => {
      const text = scene.add.text(
        centerX - (120 * index),
        bottom - 100,
        `${skill.name}`,
      );

      containerSkills.add(text)
      text.setInteractive();

      text.on('pointerdown', () => {
        scene.events.emit('skill_selected', skill);
      });
    });
  }

  private createAnimations(scene: Phaser.Scene, character: ICharacter) {
    for (const anim of character.anims) {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNames(character.key, { prefix: anim.prefix, suffix: anim.suffix, end: anim.end, zeroPad: anim.zeroPad }),
        repeat: anim.repeat,
        frameRate: anim.frameRate
      });
    }
  }
}