import React from 'react';
import classNames from 'classnames';

import { indexToCoords, range } from '../utils/general';

import stylesheet from './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderTile = this.renderTile.bind(this);
  }

  renderTile(number, i, a) {
    if (number === 0) {
      return null;
    }

    const {
      image,
      isPlayable,
      tiles,
      movableIndices,
      onMove,
      size,
    } = this.props;

    const index = tiles.indexOf(number);
    const direction = movableIndices[index];

    const handleMove = direction && isPlayable
      ? () => onMove(direction)
      : () => {};

    const [x, y] = indexToCoords(tiles, index);
    const [bgx, bgy] = indexToCoords(a, i - 1);

    const spacing = 3;
    const blockSize = ~~(100 / size);
    const imgOffset = (value) => (100 / (size - 1)) * value;

    const classList = classNames(stylesheet.tile, {
      [stylesheet.hint]: index === this.props.hintIndex,
    });

    return (
      <div
        key={number}
        className={classList}
        onClick={handleMove}
        style={{
          width: `${blockSize}%`,
          height: `${blockSize}%`,
          left: `${x * spacing}px`,
          top: `${y * spacing}px`,
          transform: `translate(${x * 100}%, ${y * 100}%)`,
          backgroundImage: `url(${image})`,
          backgroundPosition: `${imgOffset(bgx)}% ${imgOffset(bgy)}%`,
          backgroundSize: `${100 * size}%`,
        }}
      />
    );
  }

  render() {
    const tileCount = this.props.tiles.length;

    return (
      <div className={stylesheet.board}>
        {range(tileCount).map(this.renderTile)}
      </div>
    );
  }
}

Board.propTypes = {
  // a way to signal the next best move
  hintIndex: React.PropTypes.number,
  // is the game currently playable?
  isPlayable: React.PropTypes.bool,
  // the actual game state
  tiles: React.PropTypes.arrayOf(
    React.PropTypes.number
  ),
  // how many rows/columns is the board?
  size: React.PropTypes.oneOf([3, 4, 5]),
  // sparse array of tile index => direction
  movableIndices: React.PropTypes.arrayOf(
    React.PropTypes.string
  ),
  // hook for updating game state
  onMove: React.PropTypes.func,
  // the image for the tileset
  image: React.PropTypes.string,
};

export default Board;
