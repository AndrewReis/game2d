const LOCAL_STORAGE_ALL_CHARACTERS = 'GAME2D_ALL_CHARACTERS';

export function getAllChars() {
  const chars = localStorage.getItem(LOCAL_STORAGE_ALL_CHARACTERS);
  
  if (!chars) return [];
  return JSON.parse(chars);
}

export function setAllChars(chars = []) {
  localStorage.setItem(LOCAL_STORAGE_ALL_CHARACTERS, JSON.stringify(chars));
}