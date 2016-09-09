import React from 'react';
import classNames from 'classnames';

import OptionGroup from './OptionGroup';

import { indexToCoords } from '../utils/general';
import { TILESETS } from '../utils/constants';

import stylesheet from './Menu.css';

class Menu extends React.Component {
  renderTilesets() {
    return TILESETS.map((tileset, i) => {
      const { image, colors } = tileset;

      const classList = classNames(stylesheet.thumb, {
        [stylesheet.isSelected]: image === this.props.image,
      });

      const [x, y] = indexToCoords(TILESETS, i);

      return (
        <div
          key={image}
          className={classList}
          style={{
            backgroundImage: `url(${image})`,
            transform: `translate(${x * 100}%, ${y * 100}%)`,
          }}
          onClick={() => {
            this.props.onImageChange({
              image,
              colors,
            });
          }}
          title="artwork by ian sigmon"
        />
      );
    });
  }

  render() {
    const classList = classNames(stylesheet.overlay, {
      [stylesheet.isOpen]: this.props.isOpen,
    });

    return (
      <div className={classList}>
        <div className={stylesheet.menu}>
          <OptionGroup
            value={this.props.boardSize}
            onChange={this.props.onBoardSizeChange}
            options={[
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
            ]}
          />

          <OptionGroup
            value={this.props.difficulty}
            onChange={this.props.onDifficultyChange}
            options={[
              { label: 'easy', value: 'easy' },
              { label: 'medium', value: 'medium' },
              { label: 'hard', value: 'hard' },
            ]}
          />

          <div className={stylesheet.thumbContainer}>
            {this.renderTilesets()}
          </div>

          <div className={stylesheet.bb}>
            Artwork by the illustrious <a href="//gunner.work">Ian Sigmon</a>.
          </div>
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  isOpen: React.PropTypes.bool,
  boardSize: React.PropTypes.number,
  onBoardSizeChange: React.PropTypes.func,
  difficulty: React.PropTypes.string,
  onDifficultyChange: React.PropTypes.func,
  image: React.PropTypes.string,
  onImageChange: React.PropTypes.func,
};

export default Menu;
