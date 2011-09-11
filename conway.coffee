# ### Conway's Game of Life

# ![glider.png](glider.png)
#
# The universe of the Game of Life is an infinite two-dimensional orthogonal
# grid of square cells, each of which is in one of two possible states, live or
# dead.  Every cell interacts with its eight neighbors, which are the cells that
# are horizontally, vertically, or diagonally adjacent. At each step in time, the
# following transitions occur:
#
# * Any live cell with fewer than two live neighbors dies, as if caused by
# under-population.
# * Any live cell with two or three live neighbors lives on to
# the next generation.
# * Any live cell with more than three live neighbors dies,
# as if by overcrowding.
# * Any dead cell with exactly three live neighbors
# becomes a live cell, as if by reproduction.

# The initial pattern constitutes the seed of the system. The first generation is
# created by applying the above rules simultaneously to every cell in the
# seed -- births and deaths occur simultaneously, and the discrete moment at
# which this happens is sometimes called a tick (in other words, each generation
# is a pure function of the preceding one). The rules continue to be applied
# repeatedly to create further generations.
#
# *[full article on wikipedia](http://en.wikipedia.org/wiki/Conway's_Game_of_Life#Algorithms)*

class GameOfLife

  # number of rows and columns to populate
  gridSize: 50

  # size of the canvas
  canvasSize: 600

  # color to use for the lines on the grid
  lineColor: '#cdcdcd'

  # color to use for live cells on the grid
  liveColor: '#666'

  # color to use for dead cells on the grid
  deadColor: '#eee'

  # initial probability that a given cell will be live
  initialLifeProbability: 0.5

  # how fast to redraw the world in milliseconds
  animationRate: 60

  # In the constructor for the GameOfLife class we extend the game with any
  # passed in options, set the initial state of the world, and start the
  # circleOfLife.
  constructor: (options = {}) ->
    this[key] = value for key, value of options
    @world    = @createWorld()
    do @circleOfLife
    null

  # We iterate the world passing a callback that populates it with initial
  # organisms based on the initialLifeProbability.
  createWorld: ->
    @travelWorld (cell) =>
      cell.live = Math.random() < @initialLifeProbability
      cell

  # This is the main run loop for the game. At each step we iterate through
  # the world drawing each cell and resolving the next generation for that
  # cell. The results of this process become the state of the world for the
  # next generation.
  circleOfLife: =>
    @world = @travelWorld (cell) =>
      cell = @world[cell.row][cell.col]
      @draw cell
      @resolveNextGeneration cell
    setTimeout @circleOfLife, @animationRate

  # Given a cell we determine if it should be live or dead in the next
  # generation based on Conway's rules.
  resolveNextGeneration: (cell) ->
    # Determine the number of living neighbors.
    count = @countNeighbors cell
    # Make a copy of the cells current state
    cell = row: cell.row, col: cell.col, live: cell.live
    # A living cell dies if it has less than two or greater than three living neighbors
    # A nonliving cell reproduces if it has exactly 3 living neighbors
    if cell.live or count is 3
      cell.live = 1 < count < 4
    cell

  # Count the living neighbors of a given cell by iterating around the clock
  # and checking each neighbor. The helper function isAlive allows for safely
  # checking without worrying about the boundaries of the world.
  countNeighbors: (cell) ->
    neighbors = 0
    # Iterate around each neighbor of the cell and check for signs of life.
    # If the neighbor is alive increment the neighbors counter.
    for row in [-1..1]
      for col in [-1..1] when (row or col) and @isAlive cell.row + row, cell.col + col
        ++neighbors
    neighbors

  # Safely check if there is a living cell at the specified coordinates without
  # overflowing the bounds of the world
  isAlive: (row, col) -> !!@world[row]?[col]?.live

  # Iterate through the grid of the world and fire the passed in callback at
  # each location.
  travelWorld: (callback) ->
    for row in [0...@gridSize]
      for col in [0...@gridSize]
        callback.call this, row: row, col: col

  # Draw a given cell
  draw: (cell) ->
    @context  ||= @createDrawingContext()
    @cellsize ||= @canvasSize/@gridSize
    coords = [cell.row * @cellsize, cell.col * @cellsize, @cellsize, @cellsize]
    @context.strokeStyle = @lineColor
    @context.strokeRect.apply @context, coords
    @context.fillStyle = if cell.live then @liveColor else @deadColor
    @context.fillRect.apply @context, coords

  # Create the canvas drawing context.
  createDrawingContext: ->
    canvas        = document.createElement 'canvas'
    canvas.width  = @canvasSize
    canvas.height = @canvasSize
    document.body.appendChild canvas
    canvas.getContext '2d'

# Start the game by creating a new GameOfLife instance. This function is
# exported as a global.
window.conway = (options = {})-> new GameOfLife options
