# ### Conway's Game of Life

# ![glider.png](glider.png)
# 
# The universe of the Game of Life is an infinite two-dimensional orthogonal
# grid of square cells, each of which is in one of two possible states, live or
# dead.  Every cell interacts with its eight neighbours, which are the cells that
# are horizontally, vertically, or diagonally adjacent. At each step in time, the
# following transitions occur:
#
# * Any live cell with fewer than two live neighbours dies, as if caused by
# under-population.  
# * Any live cell with two or three live neighbours lives on to
# the next generation.  
# * Any live cell with more than three live neighbours dies,
# as if by overcrowding.  
# * Any dead cell with exactly three live neighbours
# becomes a live cell, as if by reproduction.  

# The initial pattern constitutes the seed of the system. The first generation is
# created by applying the above rules simultaneously to every cell in the
# seed -- births and deaths occur simultaneously, and the discrete moment at
# which this happens is sometimes called a tick (in other words, each generation
# is a pure function of the preceding one). The rules continue to be applied
# repeatedly to create further generations.
# 
# *[full article on wikipedia](http://en.wikipedia.org/wiki/Conway's_Game_of_Life#Algorithms)*

# First we define some constants that will govern how the simulation runs.
GRID_SIZE                = 100 
CANVAS_SIZE              = 500 
LIVE_COLOR               = '#000' 
DEAD_COLOR               = '#FFF' 
INITIAL_LIFE_PROBABILITY = .5 
ANIMATION_RATE           = 20

class GameOfLife

  # In the constructor for the GameOfLife class we set the initial state of
  # the world and start the circleOfLife.
  constructor: ->
    @world = @createWorld()
    @circleOfLife()

  # We iterate the world passing a callback that populates it with initial
  # organisms based on the previously defined **INITIAL_LIFE_PROBABLITY**.
  createWorld: ->
    @travelWorld (cell) => 
      if Math.random() < INITIAL_LIFE_PROBABILITY then cell.live = true
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
    setTimeout(@circleOfLife, ANIMATION_RATE)

  # Given a cell we determine if it should be live or dead in the next 
  # generation based on Conway's rules.
  resolveNextGeneration: (cell) -> 
    # Determine the number of living neighbors.
    count = @countNeighbors(cell)
    # Make a copy of the cells current state 
    cell = {row: cell.row, col: cell.col, live: cell.live}
    # The cell dies if it has less than two or greater than three neighbors
    cell.live = false if count < 2 or count > 3
    # The cell reproduces or lives on if exactly 3 neigbors
    cell.live = true  if count == 3
    cell

  # Count the living neighbors of a given cell by iterating around the clock
  # and checking each neighbor. The helper function isAlive allows for safely
  # checking without worrying about the boundries of the world.
  countNeighbors: (cell) ->
    neighbors = 0
    # Iterate around each neighbor of the cell and check for signs of life.
    # If the neighbor is alive increment the neighbors counter.
    neighbors++ if @isAlive(cell.row - 1, cell.col)
    neighbors++ if @isAlive(cell.row - 1, cell.col + 1)
    neighbors++ if @isAlive(cell.row, cell.col + 1)
    neighbors++ if @isAlive(cell.row + 1, cell.col + 1)
    neighbors++ if @isAlive(cell.row + 1, cell.col)
    neighbors++ if @isAlive(cell.row + 1, cell.col - 1)
    neighbors++ if @isAlive(cell.row, cell.col - 1)
    neighbors++ if @isAlive(cell.row - 1, cell.col - 1)
    neighbors

  # Safely check if there is a living cell at the specified coordinates without
  # overflowing the bounds of the world
  isAlive: (row, col) -> 
    @world[row]? and @world[row][col]? and @world[row][col].live  

  # Iterate through the grid of the world and fire the passed in callback at 
  # each location.
  travelWorld: (callback) ->
    for row in [0...GRID_SIZE]
      do (row) =>
        for col in [0...GRID_SIZE] 
          do (col) => callback.call(this, {row: row, col: col})

  # Draw a given cell 
  draw: (cell) ->
    @context  ||= @createDrawingContext()
    @cellsize ||= CANVAS_SIZE/GRID_SIZE
    coords = [cell.row * @cellsize, cell.col * @cellsize, @cellsize, @cellsize]
    @context.strokeRect.apply @context, coords
    @context.fillStyle = if cell.live then LIVE_COLOR else DEAD_COLOR
    @context.fillRect.apply @context, coords 

  # Create the canvas drawing context.
  createDrawingContext: ->
    canvas        = document.createElement 'canvas'
    canvas.width  = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
    document.body.appendChild canvas
    canvas.getContext '2d'

# Start the game by creating a new GameOfLife instance. This function is
# exported as a global.
window.conway = -> new GameOfLife()
