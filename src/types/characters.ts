export interface ISkill {
  name: string;
  damage: number;
  cost: number;
}

export interface ISprite extends Phaser.GameObjects.Sprite {
  hp: number;
  damage(amount: number): void;
  applySkill(skill: ISkill, target: ISprite): void;
  showSkills(scene: Phaser.Scene): void;
  createAnimations(scene: Phaser.Scene, character: ICharacter): void;
}

export interface ICharacter {
  key: string;
  health: number;
  energy: number;
  owner: boolean;
  assets: { img: string; json: string };
  anims: Array<{
    key: string,
    repeat: number,
    prefix: string,
    suffix: string,
    end: number,
    zeroPad: number,
    frameRate: number
  }>
  position: { x: number, y: number };
  skills: Array<ISkill>
}
