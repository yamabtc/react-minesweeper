(function(React) {
  "use strict";

  var Tile = React.createClass({
    handleClick: function (e) {
      var flagged = e.altKey ? true : false;
      this.props.updateGame(this.props.pos, flagged);
    },

    render: function () {
      var tile = this.props.tile
      var klass, text, count;
      if (tile.explored) {
        if (tile.bombed) {
          klass = 'bombed';
          text = "\u2622";
        } else {
          klass = 'explored';
          count = tile.adjacentBombCount();
          text = (count > 0 ? count + " " : "")
        }
      } else if (tile.flagged) {
        klass = 'flagged';
        text = "\u2691"
      } else {
        klass = 'unexplored';
      }
      klass = 'tile ' + klass

      return (
        <div className={klass} onClick={this.handleClick}>{text}</div>
      );
    }
  });

  var Board = React.createClass({
    render: function () {
      var board = this.props.board;
      var that = this;

      return(
        <div>
        {
          board.grid.map(function(row, i) {
            return (
              <div className='row' key={i}>
              {
                row.map(function(tile, j) {
                  return (
                    <Tile
                      tile={tile}
                      updateGame={that.props.updateGame}
                      pos={[i, j]}
                      key={i * board.gridSize + j} />
                  )
                })
              }
              </div>
            );
          })
        }
        </div>
      );
    }
  });

  var Game = React.createClass({
    getInitialState: function () {
      var board = new window.Minesweeper.Board(9, 10);
      return({ board: board, over: false, won: false });
    },

    restartGame: function () {
      var board = new window.Minesweeper.Board(9, 10);
      this.setState({ board: board, over: false, won: false });
    },

    updateGame: function (pos, flagged) {
      var grid = this.state.board.grid;
      if (flagged) {
        grid[pos[0]][pos[1]].toggleFlag();
      } else {
        grid[pos[0]][pos[1]].explore();
      }

      var won = this.state.board.won();
      var lost = this.state.board.lost();
      this.setState({ over: won || lost, won: won });
    },

    render: function () {
      var modal = "";
      if (this.state.over) {
        var text = this.state.won ? "You won!" : "You lost!";
        modal =
          <div className='modal-screen'>
            <div className='modal-content'>
              <p>{text}</p>
              <button onClick={this.restartGame}>Play Again</button>
            </div>
          </div>
      }

      return (
        <div>
          {modal}
          <Board board={this.state.board} updateGame={this.updateGame} />
        </div>
      )
    }
  });

  React.render(
    <Game />,
    document.getElementById('main')
  );

}(window.React));
