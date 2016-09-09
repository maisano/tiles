/**
 * A priority queue with a binary heap.
 * Made this so I didn't have to waste a bunch of time
 * sorting massive arrays when attempting to solve the
 * n-puzzle.
 */
var PriorityQueue = function PriorityQueue(comparator) {
  this.array = [];
  this.comparator = comparator || (function (a, b) { return b - a; });
};

PriorityQueue.prototype.enqueue = function enqueue (item) {
  this.array.push(item);
  this.bubbleUp();
};

PriorityQueue.prototype.dequeue = function dequeue () {
  var first = this.array[0];
  var last = this.array.pop();

  if (this.array.length > 0) {
    this.array[0] = last;
    this.bubbleDown();
  }

  return first;
};

PriorityQueue.prototype.isEmpty = function isEmpty () {
  return this.array.length === 0;
};

PriorityQueue.prototype.bubbleUp = function bubbleUp () {
    var this$1 = this;

  var position = this.array.length - 1;

  while (position > 0) {
    var item = this$1.array[position];
    var parentPosition = [position - 1] >> 1;
    var parent = this$1.array[parentPosition];

    if (this$1.comparator(item, parent) < 0) {
      this$1.array[parentPosition] = item;
      this$1.array[position] = parent;
      position = parentPosition;
    } else {
      break;
    }
  }
};

PriorityQueue.prototype.bubbleDown = function bubbleDown () {
    var this$1 = this;

  var position = 0;

  while (position < this.array.length - 1) {
    var leftIndex = (position << 1) + 1;
    var rightIndex = leftIndex + 1;

    var item = this$1.array[position];
    var leftChild = this$1.array[leftIndex];
    var rightChild = this$1.array[rightIndex];

    var childIndex;

    if (leftChild && rightChild) {
      childIndex = this$1.comparator(leftChild, rightChild) < 0
        ? leftIndex
        : rightIndex;
    } else if (leftChild) {
      childIndex = leftIndex;
    } else if (rightChild) {
      childIndex = rightIndex;
    } else {
      break;
    }

    var childItem = this$1.array[childIndex];

    if (this$1.comparator(item, childItem) > 0) {
      this$1.array[position] = childItem;
      this$1.array[childIndex] = item;

      position = childIndex;
    } else {
      break;
    }
  }
};

/**
 * Clone an array and then swap two values in it.
 *
 * @param {Array} _array An array to operate upon
 * @param {Number} indexA One position to swap
 * @param {Number} indexB Another position to swap
 * @return {Array} An array with the specified indexes' values swapped
 */
function swap(_array, indexA, indexB) {
  var array = [].concat( _array );
  var temp = array[indexA];

  array[indexA] = array[indexB];
  array[indexB] = temp;

  return array;
}

/**
 * Returns an array of zero-indexed, incrementing numbers.
 *
 * @param {Number} length The length of the desired array
 * @return {Array} An array
 */
function range(length) {
  return Array.from({ length: length }).map(function (_, i) { return i; });
}

/**
 * A naive test to validate that two arrays have value equality.
 *
 * @param {Array} a The first array
 * @param {Array} b The second array
 * @return {Boolean} Whether or not the arrays equal one another
 */
function arraysAreEqual(a, b) {
  var sameLength = a.length === b.length;
  return sameLength && a.every(function (val, i) { return val === b[i]; });
}

/**
 * Returns the coordinates of an element within an array
 * as if it were within a two-dimensional array.
 *
 * @param {Array} array An array
 * @param {Number} index The index to coordinatize
 * @return {Array} A two-length set of number coords (e.g. [0, 1])
 */
function indexToCoords(array, index) {
  var size = Math.sqrt(array.length);
  return [index % size, ~~(index / size) % size];
}

/**
 * Turns a coordinate tuple into an index of a given array.
 *
 * @param {Array} array An array
 * @param {Array} coords A pair of ints from top-left
 * @return {Number} The index representative of the coords
 */
function coordsToIndex(array, coords) {
  var size = Math.sqrt(array.length);
  var column = coords[0];
  var row = coords[1];
  return (row * size) + column;
}

var DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

var INVERSE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

var DIRECTION_DELTAS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

/**
 * Returns an array representing the completed tileset state.
 *
 * @param {Number} size How big is the game
 * @return {Array} List of numbers
 */
function getGoalState(size) {
  var goalState = range(Math.pow(size, 2));
  goalState.push(goalState.shift());
  return goalState;
}

/**
 * Gets all the legal moves zero could make, excepting
 * the previous direction.
 *
 * @param {Array} tiles A tileset
 * @param {String} lastDirection The previous direction
 */
function getBranchableDirections(tiles, lastDirection) {
  var size = Math.sqrt(tiles.length);
  var zeroIndex = tiles.indexOf(0);
  var ref = indexToCoords(tiles, zeroIndex);
  var column = ref[0];
  var row = ref[1];

  var backtrackingDirection = INVERSE_DIRECTIONS[lastDirection];

  var branchableDirections = [];

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
    .filter(function (dir) { return dir !== backtrackingDirection; });
}

/**
 * Takes a tileset and positionally moves the zero/blank.
 * Returns a new tileset.
 *
 * @param {Array} tiles A tileset
 * @param {String} direction A direction to move the zero
 * @return {Array|null} A new tileset, when given a valid direction
 */
function moveZero(tiles, direction) {
  if (!getBranchableDirections(tiles).includes(direction)) {
    throw new Error(
      ("Cannot move zero any more " + (direction.toLowerCase()) + ".")
    );
  }

  var index = tiles.indexOf(0);
  var ref = indexToCoords(tiles, index);
  var column = ref[0];
  var row = ref[1];
  var ref$1 = DIRECTION_DELTAS[direction];
  var columnDelta = ref$1[0];
  var rowDelta = ref$1[1];

  var nextCoords = [column + columnDelta, row + rowDelta];
  var nextIndex = coordsToIndex(tiles, nextCoords);

  return swap(tiles, index, nextIndex);
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
    .reduce(function (sum, i) { return sum + Math.abs(a[i] - b[i]); }, 0);
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
  var length = tiles.length;

  return tiles.map(function (number, i) { return (
    manhattanDistance(
      indexToCoords(tiles, i),
      // some wacky offsets to account for the
      // trailing zero in the goal state
      indexToCoords(tiles, number ? number - 1 : length - 1)
    )
  ); })
  .reduce(function (sum, distance) { return sum + distance; }, 0);
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
function createNode(ref) {
  var tiles = ref.tiles;
  var path = ref.path;

  return {
    tiles: tiles,
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
  var direction = node.direction;
  var path = node.path;
  var tiles = node.tiles;

  return getBranchableDirections(tiles, direction)
    .map(function (nextDirection) { return createNode({
        tiles: moveZero(tiles, nextDirection),
        path: path.concat( [nextDirection]),
      }); }
    );
}

/**
 * Takes a tileset and attempts to find a solution. A loose a*
 * search implementation.
 *
 * @param {Array} tiles A set of tiles
 * @return {Array} An array of directions to complete the puzzle
 */
function getSolution(tiles) {
  var solution;

  var size = Math.sqrt(tiles.length);

  var start = createNode({ tiles: tiles });
  var goal = createNode({ tiles: getGoalState(size) });

  var openNodes = new PriorityQueue(function (a, b) { return a.cost - b.cost; });
  openNodes.enqueue(start);

  // a hack of sorts :^)
  // dont want to deal with iterative-based array lookups
  // inside the priority queue
  var openRefs = {};

  var loop = function () {
    var node = openNodes.dequeue();

    if (arraysAreEqual(node.tiles, goal.tiles)) {
      solution = node.path;
      return 'break';
    }

    generateBranches(node).forEach(function (branch) {
      branch.cost = node.cost + heuristics(branch.tiles, goal.tiles); // eslint-disable-line

      // shhh... don't tell anyone.
      var key = branch.tiles.toString();
      var branchOnOpen = openRefs[key];

      if (!branchOnOpen) {
        openNodes.enqueue(branch);
        openRefs[key] = branch;
      } else if (branchOnOpen && branchOnOpen.path.length > branch.path.length) {
        branchOnOpen.path = branch.path;
      }
    });
  };

  while (!openNodes.isEmpty()) {
    var returned = loop();

    if ( returned === 'break' ) break;
  }

  return solution;
}

self.addEventListener('message', function (e) {
  var ref = e.data;
  var action = ref.action;
  var tiles = ref.tiles;

  if (action === 'getSolution') {
    self.postMessage({
      solution: getSolution(tiles),
    });
  } else if (action === 'getHint') {
    var direction = getSolution(tiles)[0];
    var ref$1 = DIRECTION_DELTAS[direction];
    var dx = ref$1[0];
    var dy = ref$1[1];
    var index = tiles.indexOf(0);
    var ref$2 = indexToCoords(tiles, index);
    var x = ref$2[0];
    var y = ref$2[1];
    var hintIndex = coordsToIndex(tiles, [x + dx, y + dy]);

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
      hintIndex: hintIndex,
    });
  }
}, false);