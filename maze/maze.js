class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // "path", "wall", "start", "goal"
  }

  isWalkable() {
    return (
      this.type === "path" || this.type === "start" || this.type === "goal"
    );
  }

  toString() {
    return `Tile(${this.x}, ${this.y}, ${this.type})`;
  }
}

class Maze {
  constructor(dimension, mazeEl, options = {}) {
    this.dimension = dimension; // [width, height]
    this.mazeEl = mazeEl;

    // Configuration options
    this.options = {
      wallDensity: 0.3, // Base wall probability (for field-based mazes)
      numPaths: 3, // Number of branching paths to create
      pathToGoalChance: 0.6, // 60% chance goal will be reachable
      mazeType: "field", // "field" or "line" - determines maze generation style
      ...options,
    };

    this.tiles = this.createTiles();

    if (!this.mazeEl) {
      console.error("Maze element not found");
      return;
    }
  }

  getStartIndex() {
    let number = 0;
    const start = document.querySelector(".start");

    if (start) {
      const id = start.id.split("-");
      number = (+id[0] + 1) * (+id[1] + 1);
      console.log(number);
    }

    return number;
  }

  getGoal() {
    return document.querySelector(".goal");
  }

  setDimensions(dimension) {
    this.dimension = dimension;
  }

  createTiles() {
    if (this.options.mazeType === "line") {
      return this.createLineMaze();
    } else {
      return this.createFieldMaze();
    }
  }

  createFieldMaze() {
    const tiles = [];
    const width = this.dimension[0];
    const height = this.dimension[1];

    // First, create random maze
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const type = Math.random() < this.options.wallDensity ? "wall" : "path";
        tiles.push(new Tile(x, y, type));
      }
    }

    // Generate paths
    this.generatePaths(tiles, width, height);

    return tiles;
  }

  createLineMaze() {
    const width = this.dimension[0];
    const height = this.dimension[1];

    // For line mazes, we need odd dimensions to have proper walls and passages
    // If even dimensions are provided, we'll work with them but the maze might look different
    const tiles = [];

    // Initialize all as walls
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        tiles.push(new Tile(x, y, "wall"));
      }
    }

    // Generate maze using recursive backtracking algorithm
    this.generateLineMazeRecursive(tiles, width, height);

    // Set start and goal
    const startTile = tiles.find((t) => t.x === 1 && t.y === 1) || tiles[0];
    startTile.type = "start";

    // Find a good goal position (preferably far from start)
    let goalTile = null;
    const pathTiles = tiles.filter((t) => t.type === "path");
    if (pathTiles.length > 0) {
      // Try to find the tile farthest from start
      let maxDistance = 0;
      pathTiles.forEach((tile) => {
        const distance =
          Math.abs(tile.x - startTile.x) + Math.abs(tile.y - startTile.y);
        if (distance > maxDistance) {
          maxDistance = distance;
          goalTile = tile;
        }
      });
    }

    if (!goalTile) {
      goalTile = tiles[tiles.length - 1];
    }
    goalTile.type = "goal";

    return tiles;
  }

  generateLineMazeRecursive(tiles, width, height) {
    const getIndex = (x, y) => y * width + x;
    const isValid = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

    // Start from position (1,1) if possible, otherwise (0,0)
    const startX = width > 1 ? 1 : 0;
    const startY = height > 1 ? 1 : 0;

    if (isValid(startX, startY)) {
      tiles[getIndex(startX, startY)].type = "path";
    }

    const stack = [{ x: startX, y: startY }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);

    // Directions: up, right, down, left
    const directions = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
    ];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];

      // Get unvisited neighbors
      const neighbors = [];
      directions.forEach((dir) => {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        const key = `${nx},${ny}`;

        if (isValid(nx, ny) && !visited.has(key)) {
          neighbors.push({ x: nx, y: ny, dx: dir.dx, dy: dir.dy });
        }
      });

      if (neighbors.length > 0) {
        // Choose random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Mark as visited
        visited.add(`${next.x},${next.y}`);

        // Create path to neighbor
        if (isValid(next.x, next.y)) {
          tiles[getIndex(next.x, next.y)].type = "path";
        }

        // Create path in between (remove wall)
        const betweenX = current.x + next.dx / 2;
        const betweenY = current.y + next.dy / 2;
        if (isValid(betweenX, betweenY)) {
          tiles[getIndex(betweenX, betweenY)].type = "path";
        }

        stack.push({ x: next.x, y: next.y });
      } else {
        // Backtrack
        stack.pop();
      }
    }

    // Add some random openings to make it less perfect
    if (Math.random() < 0.3) {
      this.addRandomOpenings(tiles, width, height);
    }
  }

  addRandomOpenings(tiles, width, height) {
    const getIndex = (x, y) => y * width + x;
    const numOpenings = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numOpenings; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (tiles[getIndex(x, y)].type === "wall") {
        // Only create opening if it connects two path areas
        const neighbors = [
          { x: x - 1, y: y },
          { x: x + 1, y: y },
          { x: x, y: y - 1 },
          { x: x, y: y + 1 },
        ];

        const pathNeighbors = neighbors.filter((n) => {
          if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
            const tile = tiles[getIndex(n.x, n.y)];
            return (
              tile.type === "path" ||
              tile.type === "start" ||
              tile.type === "goal"
            );
          }
          return false;
        });

        if (pathNeighbors.length >= 2) {
          tiles[getIndex(x, y)].type = "path";
        }
      }
    }
  }

  generatePaths(tiles, width, height) {
    const startTile = tiles[0];

    // Create branching paths from the start
    this.createBranchingPaths(
      tiles,
      startTile,
      width,
      height,
      this.options.numPaths
    );

    // Add random path clusters to make the maze more organic
    this.addRandomPathClusters(tiles, width, height);
  }

  createBranchingPaths(tiles, startTile, width, height, numBranches) {
    const getIndex = (x, y) => y * width + x;
    const directions = [
      { dx: 0, dy: 1 }, // down
      { dx: 1, dy: 0 }, // right
      { dx: 0, dy: -1 }, // up
      { dx: -1, dy: 0 }, // left
    ];

    for (let branch = 0; branch < numBranches; branch++) {
      let currentX = startTile.x;
      let currentY = startTile.y;

      // Pick a random direction for this branch
      let direction = directions[Math.floor(Math.random() * directions.length)];

      // Create a path of random length
      const pathLength =
        3 + Math.floor((Math.random() * Math.min(width, height)) / 2);

      for (let step = 0; step < pathLength; step++) {
        currentX += direction.dx;
        currentY += direction.dy;

        // Stop if we hit boundaries
        if (
          currentX < 0 ||
          currentX >= width ||
          currentY < 0 ||
          currentY >= height
        ) {
          break;
        }

        // Create path tile - but don't overwrite start or goal
        const index = getIndex(currentX, currentY);
        if (tiles[index].type !== "goal" && tiles[index].type !== "start") {
          tiles[index].type = "path";
        }

        // Occasionally change direction (creates more interesting paths)
        if (Math.random() < 0.3) {
          direction = directions[Math.floor(Math.random() * directions.length)];
        }

        // Occasionally branch off
        if (Math.random() < 0.2 && step > 2) {
          const branchDir =
            directions[Math.floor(Math.random() * directions.length)];
          this.createShortPath(
            tiles,
            currentX,
            currentY,
            branchDir,
            width,
            height,
            2 + Math.floor(Math.random() * 4)
          );
        }
      }
    }
  }

  createShortPath(tiles, startX, startY, direction, width, height, length) {
    const getIndex = (x, y) => y * width + x;
    let x = startX;
    let y = startY;

    for (let i = 0; i < length; i++) {
      x += direction.dx;
      y += direction.dy;

      if (x < 0 || x >= width || y < 0 || y >= height) break;

      const index = getIndex(x, y);
      // Don't overwrite start or goal tiles
      if (tiles[index].type !== "goal" && tiles[index].type !== "start") {
        tiles[index].type = "path";
      }
    }
  }

  addRandomPathClusters(tiles, width, height) {
    const getIndex = (x, y) => y * width + x;
    const numClusters = 2 + Math.floor(Math.random() * 3);

    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerX = Math.floor(Math.random() * width);
      const centerY = Math.floor(Math.random() * height);
      const clusterSize = 2 + Math.floor(Math.random() * 3);

      for (let dx = -clusterSize; dx <= clusterSize; dx++) {
        for (let dy = -clusterSize; dy <= clusterSize; dy++) {
          const x = centerX + dx;
          const y = centerY + dy;

          if (x >= 0 && x < width && y >= 0 && y < height) {
            if (Math.random() < 0.7) {
              // 70% chance for each tile in cluster
              const index = getIndex(x, y);
              // Only convert walls, preserve start and goal
              if (tiles[index].type === "wall") {
                tiles[index].type = "path";
              }
            }
          }
        }
      }
    }
  }

  drawTiles() {
    console.log("Drawing tiles...");

    if (!this.mazeEl) return console.error("Maze element not found");
    this.mazeEl.innerHTML = ""; // Clear previous tiles

    this.tiles.forEach((tile) => {
      const html = `<div class="tile ${tile.type}" id="${tile.x}-${tile.y}"></div>`;
      this.mazeEl.insertAdjacentHTML("beforeend", html);
    });

    this.mazeEl.style.gridTemplateColumns = `repeat(${this.dimension[0]}, 20px)`;
    this.mazeEl.style.gridTemplateRows = `repeat(${this.dimension[1]}, 20px)`;
  }

  getTile(x, y) {
    return this.tiles.find((tile) => tile.x === x && tile.y === y);
  }

  getTiles() {
    return this.tiles;
  }

  // Method to regenerate the maze with new random paths
  regenerate() {
    this.tiles = this.createTiles();
    this.drawTiles();
  }

  // Method to switch maze type
  setMazeType(type) {
    this.options.mazeType = type;
    this.regenerate();
  }
}
