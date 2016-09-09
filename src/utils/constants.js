export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

export const INVERSE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const DIRECTION_DELTAS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

// note that these are not the keycodes for the directions
// themselves, but for the intent in which they represent
export const DIRECTION_KEYCODES = {
  38: 'DOWN',
  40: 'UP',
  37: 'RIGHT',
  39: 'LEFT',
};

export const TILESETS = [
  {
    image: 'hand.png',
    colors: [
      '#e6e6e6',
      '#8c8c8c',
      '#f5f5f5',
    ],
  },
  {
    image: 'pinkman.jpg',
    colors: [
      '#625dc9',
      '#8866b6',
      '#5e67a2',
    ],
  },
  {
    image: 'dribble.jpg',
    colors: [
      '#d0ab83',
      '#373f4b',
      '#fddbb7',
    ],
  },
  {
    image: 'barman.jpg',
    colors: [
      '#6747a1',
      '#8768ba',
      '#997ac7',
    ],
  },
  {
    image: 'hatman.jpg',
    colors: [
      '#f4d4cf',
      '#6abbf8',
      '#c99c00',
    ],
  },
  {
    image: 'wallace.jpg',
    colors: [
      '#104f98',
      '#345aa2',
      '#8fa7d4',
      '#3084f8',
    ],
  },
  {
    image: 'milk.jpg',
    colors: [
      '#4c3748',
      '#a27572',
      '#f1837c',
    ],
  },
  {
    image: 'nick.png',
    colors: [
      '#eece2e',
      '#61c0ca',
      '#357291',
    ],
  },
  {
    image: 'late.jpg',
    colors: [
      '#c9b69c',
      '#a83e3a',
      '#2b2934',
    ],
  },
];
