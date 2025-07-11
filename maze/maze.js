class Tile {
  constructor(x, y, type = "wall") {
    this.x = x;
    this.y = y;
    this.type = type; // 'wall', 'path', 'start', 'goal'
    // this.manhattanDistance = manhattanDistance;
  }

  isWalkable() {
    return ["path", "start", "goal"].includes(this.type);
  }

  toString() {
    return `${this.type}(${this.x},${this.y})`;
  }
}

export class Maze {
  constructor(width, height, options = {}) {
    this.width = width;
    this.height = height;
    this.options = {
      type: "field", // 'field' or 'line'
      wallDensity: 0.3, // For field mazes (0-1)
      showManhattanDistance: false,
      searchSpeed: 100,
      ...options,
    };

    this.tiles = [];
    this.start = null;
    this.goal = null;
    this.displayFn = null;

    this.generate();
  }

  // Core maze generation
  generate() {
    this.tiles =
      this.options.type === "line"
        ? this._generateLineMaze()
        : this._generateFieldMaze();
  }

  _generateFieldMaze() {
    const tiles = [];

    // Create random field with walls and paths
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const type = Math.random() < this.options.wallDensity ? "wall" : "path";
        tiles.push(new Tile(x, y, type));
      }
    }

    // Ensure some connectivity by creating a few guaranteed paths
    this._addConnectivityPaths(tiles);

    return tiles;
  }

  _generateLineMaze() {
    const tiles = [];

    // Initialize all as walls
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        tiles.push(new Tile(x, y, "wall"));
      }
    }

    // Use recursive backtracking to create maze
    this._recursiveBacktrack(tiles);

    return tiles;
  }

  _addConnectivityPaths(tiles) {
    const numPaths = Math.max(
      2,
      Math.floor(Math.min(this.width, this.height) / 3)
    );

    for (let i = 0; i < numPaths; i++) {
      let x = Math.floor(Math.random() * this.width);
      let y = Math.floor(Math.random() * this.height);
      const length = 3 + Math.floor(Math.random() * 8);
      const direction = this._randomDirection();

      for (let step = 0; step < length; step++) {
        if (this._isInBounds(x, y)) {
          this._getTile(x, y, tiles).type = "path";
        }
        x += direction.dx;
        y += direction.dy;

        // Occasionally change direction
        if (Math.random() < 0.3) {
          const newDir = this._randomDirection();
          direction.dx = newDir.dx;
          direction.dy = newDir.dy;
        }
      }
    }
  }

  _recursiveBacktrack(tiles) {
    const startX = 1;
    const startY = 1;

    if (!this._isInBounds(startX, startY)) return;

    this._getTile(startX, startY, tiles).type = "path";

    const stack = [{ x: startX, y: startY }];
    const visited = new Set([`${startX},${startY}`]);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this._getUnvisitedNeighbors(current, visited, 2);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited.add(`${next.x},${next.y}`);

        // Create path to neighbor and remove wall between
        this._getTile(next.x, next.y, tiles).type = "path";
        const betweenX = current.x + (next.x - current.x) / 2;
        const betweenY = current.y + (next.y - current.y) / 2;
        this._getTile(betweenX, betweenY, tiles).type = "path";

        stack.push(next);
      } else {
        stack.pop();
      }
    }
  }

  // Start and Goal management
  setStart(x, y) {
    if (!this._isValidPosition(x, y)) return false;

    // Clear existing start if it exists and is within bounds
    if (this.start && this._isInBounds(this.start.x, this.start.y)) {
      const existingTile = this._getTile(this.start.x, this.start.y);
      if (existingTile) existingTile.type = "path";
    }

    this.start = { x, y };
    this._getTile(x, y).type = "start";
    this._updateDisplay();
    return true;
  }

  setGoal(x, y) {
    if (!this._isValidPosition(x, y)) return false;

    // Clear existing goal if it exists and is within bounds
    if (this.goal && this._isInBounds(this.goal.x, this.goal.y)) {
      const existingTile = this._getTile(this.goal.x, this.goal.y);
      if (existingTile) existingTile.type = "path";
    }

    this.goal = { x, y };
    this._getTile(x, y).type = "goal";
    this.addManhattanDistance();
    return true;
  }

  randomizeStartGoal() {
    const walkableTiles = this.tiles.filter(
      (t) => t.isWalkable() || t.type === "wall"
    );

    if (walkableTiles.length < 2) {
      console.warn("Not enough walkable tiles for start and goal");
      return false;
    }

    // Clear existing start/goal - check if they exist in current grid
    if (this.start && this._isInBounds(this.start.x, this.start.y)) {
      const startTile = this._getTile(this.start.x, this.start.y);
      if (startTile) startTile.type = "path";
    }
    if (this.goal && this._isInBounds(this.goal.x, this.goal.y)) {
      const goalTile = this._getTile(this.goal.x, this.goal.y);
      if (goalTile) goalTile.type = "path";
    }

    // Pick random positions, ensuring they're far apart
    let attempts = 0;
    let startTile, goalTile;

    do {
      startTile =
        walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
      goalTile =
        walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
      attempts++;
    } while (
      attempts < 50 &&
      (startTile === goalTile ||
        this._manhattanDistance(startTile, goalTile) < 3)
    );

    this.start = { x: startTile.x, y: startTile.y };
    this.goal = { x: goalTile.x, y: goalTile.y };

    startTile.type = "start";
    goalTile.type = "goal";

    this.addManhattanDistance();
    this._updateDisplay();
    return true;
  }

  clearStartGoal() {
    // Clear existing start/goal - check if they exist in current grid
    if (this.start && this._isInBounds(this.start.x, this.start.y)) {
      const startTile = this._getTile(this.start.x, this.start.y);
      if (startTile) startTile.type = "path";
    }
    if (this.goal && this._isInBounds(this.goal.x, this.goal.y)) {
      const goalTile = this._getTile(this.goal.x, this.goal.y);
      if (goalTile) goalTile.type = "path";
    }

    this.start = null;
    this.goal = null;
    this._updateDisplay();
  }

  // Search algorithm interface
  getNeighbors(x, y, randomize = false) {
    const neighbors = [];
    let directions = [
      { dx: 0, dy: 1 }, // down
      { dx: 1, dy: 0 }, // right
      { dx: 0, dy: -1 }, // up
      { dx: -1, dy: 0 }, // left
    ];

    // Randomize directions if requested
    if (randomize) {
      directions = this._shuffleArray([...directions]);
    }

    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      if (this._isInBounds(nx, ny)) {
        const tile = this._getTile(nx, ny);
        if (tile.isWalkable()) {
          neighbors.push(tile);
        }
      }
    }

    return neighbors;
  }

  // Helper method to shuffle array (Fisher-Yates algorithm)
  _shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  isWalkable(x, y) {
    return this._isInBounds(x, y) && this._getTile(x, y).isWalkable();
  }

  getTile(x, y) {
    return this._getTile(x, y);
  }

  addManhattanDistance() {
    if (!this.goal) return; // Add safety check

    const goalTile = this.getTile(this.goal.x, this.goal.y);
    if (!goalTile) return; // Add safety check

    this.tiles.forEach(
      (tile) =>
        (tile.manhattanDistance = this._manhattanDistance(tile, goalTile))
    );
  }

  getSpeed() {
    return this.options.searchSpeed;
  }

  updateOptions(options) {
    this.options = { ...this.options, ...options };
  }

  // Display management
  setDisplayFunction(displayFn) {
    this.displayFn = displayFn;
    this._updateDisplay();
  }

  // Utility methods
  _updateDisplay() {
    if (this.displayFn) {
      this.displayFn(
        this.tiles,
        this.width,
        this.height,
        this.options.showManhattanDistance
      );
    }
  }

  _getTile(x, y, tiles = this.tiles) {
    return tiles.find((t) => t.x === x && t.y === y);
  }

  _isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  _isValidPosition(x, y) {
    return this._isInBounds(x, y) && this._getTile(x, y).isWalkable();
  }

  _getUnvisitedNeighbors(pos, visited, step = 1) {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: step },
      { dx: step, dy: 0 },
      { dx: 0, dy: -step },
      { dx: -step, dy: 0 },
    ];

    for (const dir of directions) {
      const nx = pos.x + dir.dx;
      const ny = pos.y + dir.dy;

      if (this._isInBounds(nx, ny) && !visited.has(`${nx},${ny}`)) {
        neighbors.push({ x: nx, y: ny });
      }
    }

    return neighbors;
  }

  _randomDirection() {
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  _manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Public interface
  regenerate() {
    this.generate();
    this._updateDisplay();
  }

  getDimensions() {
    return { width: this.width, height: this.height };
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    // Clear start and goal when dimensions change to avoid out-of-bounds references
    this.start = null;
    this.goal = null;
  }

  getStart() {
    return this.start;
  }

  getGoal() {
    return this.goal;
  }

  getAllTiles() {
    return [...this.tiles];
  }

  highlightTile(x, y, color, colorType = "background") {
    const tileElement = document.getElementById(`${x}-${y}`);
    if (tileElement) {
      if (colorType === "background") {
        tileElement.style.backgroundColor = color;
        tileElement.style.color = "#fff";
      } else if (colorType === "border")
        tileElement.style.border = "4px solid " + color;
    }
  }

  // reset all highlighting
  resetHighlighting() {
    document.querySelectorAll(".path").forEach((item) => {
      item.style.border = "";
      item.style.backgroundColor = "";
      item.style.color = "";
    });

    const start = document.querySelector(".start");
    const goal = document.querySelector(".goal");

    if (start) start.style.backgroundColor = "";
    if (goal) goal.style.backgroundColor = "";
  }
}
