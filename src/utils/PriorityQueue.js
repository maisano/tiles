/**
 * A priority queue with a binary heap.
 * Made this so I didn't have to waste a bunch of time
 * sorting massive arrays when attempting to solve the
 * n-puzzle.
 */
export default class PriorityQueue {
  constructor(comparator) {
    this.array = [];
    this.comparator = comparator || ((a, b) => b - a);
  }

  enqueue(item) {
    this.array.push(item);
    this.bubbleUp();
  }

  dequeue() {
    const first = this.array[0];
    const last = this.array.pop();

    if (this.array.length > 0) {
      this.array[0] = last;
      this.bubbleDown();
    }

    return first;
  }

  isEmpty() {
    return this.array.length === 0;
  }

  bubbleUp() {
    let position = this.array.length - 1;

    while (position > 0) {
      const item = this.array[position];
      const parentPosition = [position - 1] >> 1;
      const parent = this.array[parentPosition];

      if (this.comparator(item, parent) < 0) {
        this.array[parentPosition] = item;
        this.array[position] = parent;
        position = parentPosition;
      } else {
        break;
      }
    }
  }

  bubbleDown() {
    let position = 0;

    while (position < this.array.length - 1) {
      const leftIndex = (position << 1) + 1;
      const rightIndex = leftIndex + 1;

      const item = this.array[position];
      const leftChild = this.array[leftIndex];
      const rightChild = this.array[rightIndex];

      let childIndex;

      if (leftChild && rightChild) {
        childIndex = this.comparator(leftChild, rightChild) < 0
          ? leftIndex
          : rightIndex;
      } else if (leftChild) {
        childIndex = leftIndex;
      } else if (rightChild) {
        childIndex = rightIndex;
      } else {
        break;
      }

      const childItem = this.array[childIndex];

      if (this.comparator(item, childItem) > 0) {
        this.array[position] = childItem;
        this.array[childIndex] = item;

        position = childIndex;
      } else {
        break;
      }
    }
  }
}
