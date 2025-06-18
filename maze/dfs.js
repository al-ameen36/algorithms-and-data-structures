// check top, right, bottom, left
class DepthFirstSearch {
  constructor(maze) {
    this.maze = maze;
    this.timeOuts = [];
    this.resetMaze();
  }

  resetMaze() {
    this.frontier = [];
    this.explored = [];
    this.start = 0;
    this.isSearching = false;

    this.timeOuts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.timeOuts = [];
  }

  resetHighlighting() {
    document.querySelectorAll(".tile").forEach((item) => {
      item.style.border = "";
    });
  }

  getNeighbors(tile) {
    let newArray = [];
    const neighbors = [
      [tile.x + 1, tile.y],
      [tile.x, tile.y + 1],
      [tile.x - 1, tile.y],
      [tile.x, tile.y - 1],
    ];

    neighbors.forEach((tileCoords) => {
      const item = this.maze.getTile(...tileCoords);
      if (item) {
        newArray.push(item);
      }
    });

    return newArray;
  }

  highlightTile(x, y, color) {
    const tileElement = document.getElementById(`${x}-${y}`);
    if (tileElement) tileElement.style.border = "4px solid " + color;
  }

  findGoal() {
    this.resetMaze();
    this.resetHighlighting();
    this.isSearching = true;

    const firstTile = this.maze.tiles[this.start];
    if (firstTile.type === "goal") return firstTile;

    // Add new paths to the queue
    this.frontier.push(...this.getNeighbors(firstTile));

    // Take next steps
    this.step();
  }

  ifExists(tile) {
    return Boolean(
      this.explored.find((item) => item.x === tile.x && item.y === tile.y)
    );
  }

  step() {
    if (!this.isSearching) return;
    if (!this.frontier.length) {
      console.log("No more tiles and goal not found");
      console.log("Steps taken: " + this.explored.length);
      return null;
    }

    let currentTile = this.frontier.pop();
    if (!this.ifExists(currentTile)) {
      this.explored.push(currentTile);

      // Stop searching if current tile is the goal
      if (currentTile.type === "goal") {
        console.log(`Goal found at x: ${currentTile.x}, y: ${currentTile.y}`);
        console.log("Steps taken: " + this.explored.length);
        this.highlightTile(currentTile.x, currentTile.y, "red");
        return currentTile;
      }
      // Continue if current tile is not the goal
      else if (currentTile.type === "path") {
        this.highlightTile(currentTile.x, currentTile.y, "purple");

        let neighbors = this.getNeighbors(currentTile);
        neighbors = neighbors.filter(
          (item) => !this.ifExists(item) && item.isWalkable()
        );
        neighbors.forEach((item) => this.frontier.push(item));
      }
      // Move to next step
      this.timeOuts.push(setTimeout(() => this.step(), 100));
    } else {
      this.step();
    }
  }
}
