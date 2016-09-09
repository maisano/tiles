/**
 * Returns a random int. Excludes `max`.
 *
 * @param {Number} min The lower bound
 * @param {Number} max The exclusive upper bound
 * @param {Number} A random integer
 */
export function randomInt(min, max) {
  return ~~(Math.random() * (max - min)) + min;
}

/**
 * Return a randomly selected element from an array.
 *
 * @param {Array} array The array to pull from
 * @param {Object} A randomly selected item
 */
export function sample(array) {
  return array[randomInt(0, array.length)];
}

/**
 * Clone an array and then swap two values in it.
 *
 * @param {Array} _array An array to operate upon
 * @param {Number} indexA One position to swap
 * @param {Number} indexB Another position to swap
 * @return {Array} An array with the specified indexes' values swapped
 */
export function swap(_array, indexA, indexB) {
  const array = [..._array];
  const temp = array[indexA];

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
export function range(length) {
  return Array.from({ length }).map((_, i) => i);
}

/**
 * Returns, uh, whether a number is even or not.
 *
 * @param {Number} num A number to validate the even-ness of
 * @return {Boolean} You know the deal
 */
export function isEven(num) {
  return num % 2 === 0;
}

/**
 * A naive test to validate that two arrays have value equality.
 *
 * @param {Array} a The first array
 * @param {Array} b The second array
 * @return {Boolean} Whether or not the arrays equal one another
 */
export function arraysAreEqual(a, b) {
  const sameLength = a.length === b.length;
  return sameLength && a.every((val, i) => val === b[i]);
}

/**
 * Returns the coordinates of an element within an array
 * as if it were within a two-dimensional array.
 *
 * @param {Array} array An array
 * @param {Number} index The index to coordinatize
 * @return {Array} A two-length set of number coords (e.g. [0, 1])
 */
export function indexToCoords(array, index) {
  const size = Math.sqrt(array.length);
  return [index % size, ~~(index / size) % size];
}

/**
 * Turns a coordinate tuple into an index of a given array.
 *
 * @param {Array} array An array
 * @param {Array} coords A pair of ints from top-left
 * @return {Number} The index representative of the coords
 */
export function coordsToIndex(array, coords) {
  const size = Math.sqrt(array.length);
  const [column, row] = coords;
  return (row * size) + column;
}
