export const randBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);
export const randInt = (max: number) => randBetween(0, max);
export const randID = () => Math.random().toString(36).slice(2);
//Random four letter word of characters
export const randWord = () =>
  Array.from(Array(4))
    .map(() => String.fromCharCode(randInt(26) + 97))
    .join("")
    .toUpperCase();  
