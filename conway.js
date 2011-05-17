(function() {
  var GameOfLife, conway;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  GameOfLife = (function() {
    GameOfLife.prototype.gridSize = 50;
    GameOfLife.prototype.canvasSize = 600;
    GameOfLife.prototype.lineColor = '#cdcdcd';
    GameOfLife.prototype.liveColor = '#666';
    GameOfLife.prototype.deadColor = '#eee';
    GameOfLife.prototype.initialLifeProbability = 0.5;
    GameOfLife.prototype.animationRate = 60;
    function GameOfLife(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      this.circleOfLife = __bind(this.circleOfLife, this);;
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.world = this.createWorld();
      this.circleOfLife();
    }
    GameOfLife.prototype.createWorld = function() {
      return this.travelWorld(__bind(function(cell) {
        if (Math.random() < this.initialLifeProbability) {
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
      return setTimeout(this.circleOfLife, this.animationRate);
    };
    GameOfLife.prototype.resolveNextGeneration = function(cell) {
      var count;
      count = this.countNeighbors(cell);
      cell = {
        row: cell.row,
        col: cell.col,
        live: cell.live
      };
      if (count < 2 || count > 3) {
        cell.live = false;
      }
      if (count === 3) {
        cell.live = true;
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
      return this.world[row] && this.world[row][col] && this.world[row][col].live;
    };
    GameOfLife.prototype.travelWorld = function(callback) {
      var row, _ref, _results;
      _results = [];
      for (row = 0, _ref = this.gridSize; 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
        _results.push(__bind(function(row) {
          var col, _ref2, _results2;
          _results2 = [];
          for (col = 0, _ref2 = this.gridSize; 0 <= _ref2 ? col < _ref2 : col > _ref2; 0 <= _ref2 ? col++ : col--) {
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
      this.context || (this.context = this.createDrawingContext());
      this.cellsize || (this.cellsize = this.canvasSize / this.gridSize);
      coords = [cell.row * this.cellsize, cell.col * this.cellsize, this.cellsize, this.cellsize];
      this.context.strokeStyle = this.lineColor;
      this.context.strokeRect.apply(this.context, coords);
      this.context.fillStyle = cell.live ? this.liveColor : this.deadColor;
      return this.context.fillRect.apply(this.context, coords);
    };
    GameOfLife.prototype.createDrawingContext = function() {
      var canvas;
      canvas = document.createElement('canvas');
      canvas.width = this.canvasSize;
      canvas.height = this.canvasSize;
      document.body.appendChild(canvas);
      return canvas.getContext('2d');
    };
    return GameOfLife;
  })();
  conway = function(options) {
    return new GameOfLife();
  };
  if (typeof exports !== "undefined" && exports !== null) {
    exports.conway = conway;
  } else {
    window.conway = conway;
  }
}).call(this);
