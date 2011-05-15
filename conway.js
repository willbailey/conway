(function() {
  var ANIMATION_RATE, CANVAS_SIZE, DEAD_COLOR, GRID_SIZE, GameOfLife, INITIAL_LIFE_PROBABILITY, LIVE_COLOR;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  GRID_SIZE = 100;
  CANVAS_SIZE = 500;
  LIVE_COLOR = '#000';
  DEAD_COLOR = '#FFF';
  INITIAL_LIFE_PROBABILITY = .5;
  ANIMATION_RATE = 20;
  GameOfLife = (function() {
    function GameOfLife() {
      this.circleOfLife = __bind(this.circleOfLife, this);;      this.world = this.createWorld();
      this.circleOfLife();
    }
    GameOfLife.prototype.createWorld = function() {
      return this.travelWorld(__bind(function(cell) {
        if (Math.random() < INITIAL_LIFE_PROBABILITY) {
          cell.live = true;
        }
        return cell;
      }, this));
    };
    GameOfLife.prototype.circleOfLife = function() {
      this.world = this.travelWorld(__bind(function(cell) {
        cell = this.world[cell.row][cell.col];
        this.draw(cell);
        return this.resolveNextGeneration(cell);
      }, this));
      return setTimeout(this.circleOfLife, ANIMATION_RATE);
    };
    GameOfLife.prototype.resolveNextGeneration = function(cell) {
      var count;
      count = this.countNeighbors(cell);
      cell = {
        row: cell.row,
        col: cell.col,
        live: cell.live
      };
      if (count < 2) {
        cell.live = false;
      }
      if (count === 3) {
        cell.live = true;
      }
      if (count > 3) {
        cell.live = false;
      }
      return cell;
    };
    GameOfLife.prototype.countNeighbors = function(cell) {
      var neighbors;
      neighbors = 0;
      if (this.isAlive(cell.row - 1, cell.col)) {
        neighbors++;
      }
      if (this.isAlive(cell.row - 1, cell.col + 1)) {
        neighbors++;
      }
      if (this.isAlive(cell.row, cell.col + 1)) {
        neighbors++;
      }
      if (this.isAlive(cell.row + 1, cell.col + 1)) {
        neighbors++;
      }
      if (this.isAlive(cell.row + 1, cell.col)) {
        neighbors++;
      }
      if (this.isAlive(cell.row + 1, cell.col - 1)) {
        neighbors++;
      }
      if (this.isAlive(cell.row, cell.col - 1)) {
        neighbors++;
      }
      if (this.isAlive(cell.row - 1, cell.col - 1)) {
        neighbors++;
      }
      return neighbors;
    };
    GameOfLife.prototype.isAlive = function(row, col) {
      return (this.world[row] != null) && (this.world[row][col] != null) && this.world[row][col].live;
    };
    GameOfLife.prototype.travelWorld = function(callback) {
      var row, _results;
      _results = [];
      for (row = 0; 0 <= GRID_SIZE ? row < GRID_SIZE : row > GRID_SIZE; 0 <= GRID_SIZE ? row++ : row--) {
        _results.push(__bind(function(row) {
          var col, _results2;
          _results2 = [];
          for (col = 0; 0 <= GRID_SIZE ? col < GRID_SIZE : col > GRID_SIZE; 0 <= GRID_SIZE ? col++ : col--) {
            _results2.push(__bind(function(col) {
              return callback.call(this, {
                row: row,
                col: col
              });
            }, this)(col));
          }
          return _results2;
        }, this)(row));
      }
      return _results;
    };
    GameOfLife.prototype.draw = function(cell) {
      var coords;
      this.canvas || (this.canvas = this.createCanvas());
      this.cellsize || (this.cellsize = CANVAS_SIZE / GRID_SIZE);
      coords = [cell.row * this.cellsize, cell.col * this.cellsize, this.cellsize, this.cellsize];
      this.context.strokeRect.apply(this.context, coords);
      this.context.fillStyle = cell.live ? LIVE_COLOR : DEAD_COLOR;
      return this.context.fillRect.apply(this.context, coords);
    };
    GameOfLife.prototype.createCanvas = function() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = CANVAS_SIZE;
      this.canvas.height = CANVAS_SIZE;
      document.body.appendChild(this.canvas);
      return this.context = this.canvas.getContext('2d');
    };
    return GameOfLife;
  })();
  window.conway = function() {
    return new GameOfLife();
  };
}).call(this);
