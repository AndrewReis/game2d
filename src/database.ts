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
  skillSelected?: {
    name: string;
    description: string;
    damage: number;
    cost: number;
  };
  position: { x: number, y: number };
  skills: Array<{
    name: string;
    description: string;
    damage: number;
    cost: number;
  }>
}

const characters: ICharacter[] = [
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
      { name: 'Rasengan', description: 'A powerful spiraling sphere of chakra.', damage: 50, cost: 30 },
      { name: 'Shadow Clone Jutsu', description: 'Creates multiple copies of Naruto.', damage: 50, cost: 30 },
      { name: 'Recarregar', description: 'Recupera um pouco da energia.', damage: 0, cost: 0 }
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
      { name: 'Chidori', description: 'A high concentration of lightning chakra.', damage: 50, cost: 30 },
      { name: 'Sharingan', description: 'Enhances perception and combat skills.', damage: 50, cost: 30 }
    ]
  }
];

export const database = {
  characters,
  state: {
    currentTurn: 0,
    currentCharacter: {}
  }
}