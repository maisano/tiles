import { getSolution } from './utils/game';
import { indexToCoords, coordsToIndex } from './utils/general';
import { DIRECTION_DELTAS } from './utils/constants';

self.addEventListener('message', (e) => {
  const { action, tiles } = e.data;

  if (action === 'getSolution') {
    self.postMessage({
      solution: getSolution(tiles),
    });
  } else if (action === 'getHint') {
    const direction = getSolution(tiles)[0];
    const [dx, dy] = DIRECTION_DELTAS[direction];
    const index = tiles.indexOf(0);
    const [x, y] = indexToCoords(tiles, index);
    const hintIndex = coordsToIndex(tiles, [x + dx, y + dy]);

    // consider the following:
    //
    // [ 1, 2, 3 ]
    // [ 4, 5, 0 ]
    // [ 7, 8, 6 ]
    //
    // zero needs to move DOWN
    // so return the index of the item
    // in that position

    self.postMessage({
      hintIndex,
    });
  }
}, false);
