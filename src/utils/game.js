import PriorityQueue from './PriorityQueue';

import {
  arraysAreEqual,
  coordsToIndex,
  indexToCoords,
  range,
  randomInt,
  sample,
  swap,
} from './general';

import {
  DIRECTIONS,
  INVERSE_DIRECTIONS,
  DIRECTION_DELTAS,
} from './constants';

/**
 * Returns the inverse direction of `direction`.
 *
 * @param {String} direction The direction
 * @return {String} The direction's opposite
 */
export function getInverseDirection(direction) {
  return INVERSE_DIRECTIONS[direction];
}

/**
 * Returns an array representing the completed tileset state.
 *
 * @param {Number} size How big is the game
 * @return {Array} List of numbers
 */
function getGoalState(size) {
  const goalState = range(Math.pow(size, 2));
  goalState.push(goalState.shift());
  return goalState;
}

/**
 * Is the game over?
 *
 * @param {Array} tiles A tileset
 * @return {Boolean} Whether or not the game has been won
 */
export function wonGame(tiles) {
  const size = Math.sqrt(tiles.length);
  return arraysAreEqual(tiles, getGoalState(size));
}


/**
 * Gets all the legal moves zero could make, excepting
 * the previous direction.
 *
 * @param {Array} tiles A tileset
 * @param {String} lastDirection The previous direction
 */
function getBranchableDirections(tiles, lastDirection) {
  const size = Math.sqrt(tiles.length);
  const zeroIndex = tiles.indexOf(0);
  const [column, row] = indexToCoords(tiles, zeroIndex);

  const backtrackingDirection = INVERSE_DIRECTIONS[lastDirection];

  const branchableDirections = [];

  if (row === 0) {
    branchableDirections.push(DIRECTIONS.DOWN);
  } else if (row === size - 1) {
    branchableDirections.push(DIRECTIONS.UP);
  } else {
    branchableDirections.push(DIRECTIONS.DOWN, DIRECTIONS.UP);
  }

  if (column === 0) {
    branchableDirections.push(DIRECTIONS.RIGHT);
  } else if (column === size - 1) {
    branchableDirections.push(DIRECTIONS.LEFT);
  } else {
    branchableDirections.push(DIRECTIONS.RIGHT, DIRECTIONS.LEFT);
  }

  return branchableDirections
    .filter(dir => dir !== backtrackingDirection);
}

/**
 * Takes tiles, returns all possible indices of the tileset
 * that are able to swap with zero. Excepts the previous
 * move.
 *
 * @param {Array} tiles A tileset
 * @param {String} previousDirection The previous direction
 */
export function getMovableIndices(tiles, previousDirection) {
  const zeroIndex = tiles.indexOf(0);
  const [column, row] = indexToCoords(tiles, zeroIndex);

  return getBranchableDirections(tiles, previousDirection)
    .reduce((arr, direction) => {
      const [columnDelta, rowDelta] = DIRECTION_DELTAS[direction];

      const nextCoords = [column + columnDelta, row + rowDelta];
      const nextIndex = coordsToIndex(tiles, nextCoords);

      arr[nextIndex] = direction; // eslint-disable-line
      return arr;
    }, []);
}

/**
 * Takes a tileset and positionally moves the zero/blank.
 * Returns a new tileset.
 *
 * @param {Array} tiles A tileset
 * @param {String} direction A direction to move the zero
 * @return {Array|null} A new tileset, when given a valid direction
 */
export function moveZero(tiles, direction) {
  if (!getBranchableDirections(tiles).includes(direction)) {
    throw new Error(
      `Cannot move zero any more ${direction.toLowerCase()}.`
    );
  }

  const index = tiles.indexOf(0);
  const [column, row] = indexToCoords(tiles, index);
  const [columnDelta, rowDelta] = DIRECTION_DELTAS[direction];

  const nextCoords = [column + columnDelta, row + rowDelta];
  const nextIndex = coordsToIndex(tiles, nextCoords);

  return swap(tiles, index, nextIndex);
}

// function _moveZero(tiles, direction) {
//   const size = Math.sqrt(tiles.length);
//   const zeroIndex = tiles.indexOf(0);
//   const zeroColumn = zeroIndex % size;
//   const zeroRow = ~~(zeroIndex / size) % size;
//
//   if (direction === DIRECTIONS.UP && zeroRow > 0) {
//     return swap(tiles, zeroIndex, zeroIndex - size);
//   } else if (direction === DIRECTIONS.DOWN && zeroRow < size - 1) {
//     return swap(tiles, zeroIndex, zeroIndex + size);
//   } else if (direction === DIRECTIONS.LEFT && zeroColumn > 0) {
//     return swap(tiles, zeroIndex, zeroIndex - 1);
//   } else if (direction === DIRECTIONS.RIGHT && zeroColumn < size - 1) {
//     return swap(tiles, zeroIndex, zeroIndex + 1);
//   }
//
//   return null;
// }

/**
 * Takes a set of tiles and moves the zero around an
 * arbitrarily-ranged number of times.
 *
 * @param {Array} _tiles A tileset
 * @param {Number} minSteps A minimum number of times to shuffle
 * @param {Number} maxSteps A maximum number of times to shuffle
 * @return {Array} A shuffled tileset
 */
function shuffleTiles(_tiles, minSteps = 18, maxSteps = 30) {
  const shuffleCount = randomInt(minSteps, maxSteps + 1);

  let i = 0;
  let lastDirection;
  let tiles = _tiles;

  while (i < shuffleCount || arraysAreEqual(_tiles, tiles)) {
    const validDirections = getBranchableDirections(tiles, lastDirection);
    const direction = sample(validDirections);

    tiles = moveZero(tiles, direction);
    lastDirection = direction;
    i++;
  }

  return tiles;
}

/**
 * Returns a new game, i.e. a solvable, shuffled set of tiles.
 *
 * @param {Number} size The width/height of the board
 * @param {String} difficulty How "shuffled" the game should start
 * @return {Array} A new, shuffled tileset
 */
export function newGame(size = 3, difficulty) {
  let min;
  let max;

  switch (difficulty) {
    case 'easy':
      min = 60;
      max = 90;
      break;
    case 'hard':
      min = 150;
      max = 250;
      break;
    case 'medium':
    default:
      min = 100;
      max = 150;
      break;
  }

  min = ~~(min / (size * 2));
  max = ~~(max / (size * 2));

  return shuffleTiles(getGoalState(size), min, max);
}

/**
 * Returns the Manhattan distance of two arrays.
 *
 * @param {Array} a An array of numbers
 * @param {Array} b An array of numbers
 * @return {Number} The Manhattan distance
 */
function manhattanDistance(a, b) {
  return range(a.length)
    .reduce((sum, i) => sum + Math.abs(a[i] - b[i]), 0);
}

/**
 * Simple heuristics for the a*-ish algorithm used to
 * solve puzzles. Simply tallies up the Manhattan distance
 * of each tile to its goal state.
 *
 * @param {Array} tiles A tileset
 * @return {Number} The total of all Manhattan distances
 */
function heuristics(tiles) {
  const length = tiles.length;

  return tiles.map((number, i) => (
    manhattanDistance(
      indexToCoords(tiles, i),
      // some wacky offsets to account for the
      // trailing zero in the goal state
      indexToCoords(tiles, number ? number - 1 : length - 1)
    )
  ))
  .reduce((sum, distance) => sum + distance, 0);
}

/**
 * Creates a node which represents a puzzle state--
 * a tileset, a path to get there, as well as a
 * cost to get there.
 *
 * @param {Object} options
 * @param {Array} options.tiles A tileset
 * @param {String} options.direction A direction
 * @param {Array} options.path An array of directions
 * @return {Object} A puzzle state node
 */
function createNode({ tiles, path }) {
  return {
    tiles,
    cost: 0,
    path: path || [],
  };
}

/**
 * Takes a node/puzzle state and returns a list of possible
 * next states. Will omit the inverse of the node's direction.
 *
 * @param {Object} node A puzzle state
 * @return {Array} A list of all possible, next puzzle state nodes
 */
function generateBranches(node) {
  const { direction, path, tiles } = node;

  return getBranchableDirections(tiles, direction)
    .map(nextDirection =>
      createNode({
        tiles: moveZero(tiles, nextDirection),
        path: [...path, nextDirection],
      })
    );
}

/**
 * Takes a tileset and attempts to find a solution. A loose a*
 * search implementation.
 *
 * @param {Array} tiles A set of tiles
 * @return {Array} An array of directions to complete the puzzle
 */
export function getSolution(tiles) {
  let solution;

  const size = Math.sqrt(tiles.length);

  const start = createNode({ tiles });
  const goal = createNode({ tiles: getGoalState(size) });

  const openNodes = new PriorityQueue((a, b) => a.cost - b.cost);
  openNodes.enqueue(start);

  // a hack of sorts :^)
  // dont want to deal with iterative-based array lookups
  // inside the priority queue
  const openRefs = {};

  while (!openNodes.isEmpty()) {
    const node = openNodes.dequeue();

    if (arraysAreEqual(node.tiles, goal.tiles)) {
      solution = node.path;
      break;
    }

    generateBranches(node).forEach(branch => {
      branch.cost = node.cost + heuristics(branch.tiles, goal.tiles); // eslint-disable-line

      // shhh... don't tell anyone.
      const key = branch.tiles.toString();
      const branchOnOpen = openRefs[key];

      if (!branchOnOpen) {
        openNodes.enqueue(branch);
        openRefs[key] = branch;
      } else if (branchOnOpen && branchOnOpen.path.length > branch.path.length) {
        branchOnOpen.path = branch.path;
      }
    });
  }

  return solution;
}
