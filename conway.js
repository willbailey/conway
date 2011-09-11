(function() {
  var GameOfLife;
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
      if (options == null) options = {};
      this.circleOfLife = __bind(this.circleOfLife, this);
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.world = this.createWorld();
      this.circleOfLife();
      null;
    }
    GameOfLife.prototype.createWorld = function() {
      return this.travelWorld(__bind(function(cell) {
        cell.live = Math.random() < this.initialLifeProbability;
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
      if (cell.live || count === 3) cell.live = (1 < count && count < 4);
      return cell;
    };
    GameOfLife.prototype.countNeighbors = function(cell) {
      var col, neighbors, row;
      neighbors = 0;
      for (row = -1; row <= 1; row++) {
        for (col = -1; col <= 1; col++) {
          if ((row || col) && this.isAlive(cell.row + row, cell.col + col)) {
            ++neighbors;
          }
        }
      }
      return neighbors;
    };
    GameOfLife.prototype.isAlive = function(row, col) {
      var _ref, _ref2;
      return !!((_ref = this.world[row]) != null ? (_ref2 = _ref[col]) != null ? _ref2.live : void 0 : void 0);
    };
    GameOfLife.prototype.travelWorld = function(callback) {
      var col, row, _ref, _results;
      _results = [];
      for (row = 0, _ref = this.gridSize; 0 <= _ref ? row < _ref : row > _ref; 0 <= _ref ? row++ : row--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (col = 0, _ref2 = this.gridSize; 0 <= _ref2 ? col < _ref2 : col > _ref2; 0 <= _ref2 ? col++ : col--) {
            _results2.push(callback.call(this, {
              row: row,
              col: col
            }));
          }
          return _results2;
        }).call(this));
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
  window.conway = function(options) {
    if (options == null) options = {};
    return new GameOfLife(options);
  };
}).call(this);
