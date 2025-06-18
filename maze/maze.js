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
      wallDensity: 0.3, // Base wall probability (reduced from 0.2 to make room for paths)
      numPaths: 3, // Number of branching paths to create
      pathToGoalChance: 0.6, // 60% chance goal will be reachable
      ...options,
    };

    this.tiles = this.createTiles();

    if (!this.mazeEl) {
      console.error("Maze element not found");
      return;
    }
  }

  createTiles() {
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

    // Set start and goal positions
    const startIndex = 0;
    const goalIndex = tiles.length - 1;
    tiles[startIndex].type = "start";
    tiles[goalIndex].type = "goal";

    // Generate paths
    this.generatePaths(tiles, width, height);

    return tiles;
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
}
