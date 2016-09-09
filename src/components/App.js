import React from 'react';
import classNames from 'classnames';

import Board from './Board';
import LoadingSpinner from './LoadingSpinner';
import Menu from './Menu';

import {
  getInverseDirection,
  getMovableIndices,
  moveZero,
  newGame,
  wonGame,
} from '../utils/game';

import { DIRECTION_KEYCODES, TILESETS } from '../utils/constants';

import stylesheet from './App.css';

const worker = new Worker('worker.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    const boardSize = 3;
    const difficulty = 'medium';
    const tiles = newGame(boardSize, difficulty);
    const movableIndices = getMovableIndices(tiles);
    const { image, colors } = TILESETS[0];

    this.state = {
      boardSize,
      colors,
      difficulty,
      hintIndex: null,
      image,
      isMenuOpen: false,
      isPlayable: true,
      isThinking: false,
      movableIndices,
      path: [],
      tiles,
    };

    // rip createClass...
    this.revertMove = this.revertMove.bind(this);
    this.getSolution = this.getSolution.bind(this);
    this.getHint = this.getHint.bind(this);
    this.solve = this.solve.bind(this);
    this.toggleIsMenuOpen = this.toggleIsMenuOpen.bind(this);

    this.handleMove = this.handleMove.bind(this);
    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleWorkerMessage = this.handleWorkerMessage.bind(this);
  }

  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyUp);
    worker.addEventListener('message', this.handleWorkerMessage, false);
  }

  // this will never unmount, buuuut would be remiss to leave it out
  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
    worker.removeEventListener('message', this.handleWorkerMessage, false);
  }

  getSolution() {
    this.setState({
      isThinking: true,
      isPlayable: false,
    });

    worker.postMessage({
      action: 'getSolution',
      tiles: this.state.tiles,
    });
  }

  getHint() {
    this.setState({
      isThinking: true,
      isPlayable: false,
    });

    worker.postMessage({
      action: 'getHint',
      tiles: this.state.tiles,
    });
  }

  solve(steps) {
    if (steps.length > 0) {
      this.handleMove(steps[0]);
      setTimeout(() => this.solve(steps.slice(1)), 300);
    }
  }

  revertMove() {
    const { path } = this.state;
    const previousDirection = path[path.length - 1];
    const direction = getInverseDirection(previousDirection);

    const tiles = moveZero(this.state.tiles, direction);
    const movableIndices = getMovableIndices(tiles);

    this.setState({
      tiles,
      movableIndices,
      path: path.slice(0, -1),
    });
  }

  handleKeyUp(e) {
    const direction = DIRECTION_KEYCODES[e.which];
    if (direction && this.state.isPlayable) {
      this.handleMove(direction);
    }
  }

  handleWorkerMessage(e) {
    const { solution, hintIndex } = e.data;

    if (solution) {
      this.setState({
        isThinking: false,
      });

      this.solve(solution);
    }

    if (typeof hintIndex === 'number') {
      this.setState({
        isThinking: false,
        isPlayable: true,
        hintIndex,
      });
    }
  }

  handleMove(direction) {
    const tiles = moveZero(this.state.tiles, direction);
    const movableIndices = getMovableIndices(tiles);
    const isGameOver = wonGame(tiles);
    const playerWon = isGameOver && this.state.isPlayable;

    this.setState({
      hintIndex: null,
      isGameOver,
      tiles,
      movableIndices,
      path: [...this.state.path, direction],
    }, () => {
      if (isGameOver) {
        // uhh, i dont normally code so sloppily.
        setTimeout(() => {
          const message = playerWon
            ? 'great job! you won! play again?'
            : 'game over bb. try again?';
          if (confirm(message)) { // eslint-disable-line
            this.newGame();
          } else {
            this.setState({
              isPlayable: false,
            });
          }
        }, 300);
      }
    });
  }

  handleImageChange({ image, colors }) {
    this.setState({
      image,
      colors,
    }, this.newGame);
  }

  handleBoardSizeChange(boardSize) {
    this.newGame(boardSize);
  }

  handleDifficultyChange(difficulty) {
    this.setState({
      difficulty,
    }, this.newGame);
  }

  newGame(size) {
    const boardSize = size || this.state.boardSize;
    const tiles = newGame(boardSize, this.state.difficulty);
    const movableIndices = getMovableIndices(tiles);

    this.setState({
      boardSize,
      tiles,
      movableIndices,
      path: [],
      isGameOver: false,
      isPlayable: true,
    });
  }

  toggleIsMenuOpen() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  render() {
    const menuToggleClassList = classNames(stylesheet.menuToggle, {
      [stylesheet.on]: this.state.isMenuOpen,
    });

    return (
      <div className={stylesheet.container}>
        <header>
          <h1 className={stylesheet.title}>Tiles</h1>
        </header>

        <section className={stylesheet.boardContainer}>
          <Board
            hintIndex={this.state.hintIndex}
            image={this.state.image}
            isPlayable={this.state.isPlayable}
            movableIndices={this.state.movableIndices}
            onMove={this.handleMove}
            size={this.state.boardSize}
            tiles={this.state.tiles}
          />
          <LoadingSpinner isLoading={this.state.isThinking} />
        </section>

        <Menu
          isOpen={this.state.isMenuOpen}
          boardSize={this.state.boardSize}
          onBoardSizeChange={this.handleBoardSizeChange}
          difficulty={this.state.difficulty}
          onDifficultyChange={this.handleDifficultyChange}
          image={this.state.image}
          onImageChange={this.handleImageChange}
        />
        <div
          className={menuToggleClassList}
          onClick={this.toggleIsMenuOpen}
        >
          +
        </div>

        <footer className={stylesheet.footer}>
          <div
            className={stylesheet.button}
            onClick={this.getHint}
          >
            hint
          </div>
          <div className={stylesheet.moves}>
            {this.state.path.length}
          </div>
          <div
            className={stylesheet.button}
            onClick={this.getSolution}
          >
            solve
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
