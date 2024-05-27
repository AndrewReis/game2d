import { ICharacter } from "../types/characters";

const p1Characters: ICharacter[] = [];
const p2Characters: ICharacter[] = [];

for (let index = 0; index < 3; index++) {
  p1Characters.push({
    key: `char${index}`,
    assets: {
      img: 'chars/char11.png',
      json: 'chars/char11.json'
    },
    anims: [
      {
        key: `idle_char${index}`,
        repeat: -1,
        prefix: 'idle_',
        suffix: '.png',
        end: 4,
        zeroPad: 0,
        frameRate: 10
      }
    ],
    position: { x: 0, y: 0 },
    health: 100,
    energy: 100,
    owner: true,
    skills: [
      { name: 'Ataque', damage: 50, cost: 30 },
      { name: 'Recarregar', damage: 0, cost: 0 },
    ]
  });
}

for (let index = 0; index < 3; index++) {
  p2Characters.push({
    key: `char${(index + 2) * 5}`,
    assets: {
      img: 'chars/char14.png',
      json: 'chars/char14.json'
    },
    anims: [
      {
        key: `idle_char${index * 5}`,
        repeat: -1,
        prefix: 'idle_',
        suffix: '.png',
        end: 4,
        zeroPad: 0,
        frameRate: 10
      }
    ],
    position: { x: 0, y: 0 },
    health: 100,
    energy: 100,
    owner: false,
    skills: [
      { name: 'Ataque', damage: 50, cost: 30 },
      { name: 'Recarregar', damage: 0, cost: 0 },
    ]
  });
}

export const characters: ICharacter[] = [...p1Characters, ...p2Characters];