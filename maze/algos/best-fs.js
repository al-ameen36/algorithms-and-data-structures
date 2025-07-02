export class DepthFirstSearch {
  #maze;
  #isSearching;

  constructor(maze) {
    this.#maze = maze;

    this.reset();
  }

  stop() {
    this.reset();
    this.#maze.resetHighlighting();
  }

  reset() {
    this.#isSearching = false;
    this.frontier = [];
    this.explored = [];

    if (this.timeOuts)
      this.timeOuts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    this.timeOuts = [];
  }

  isAlreadyExplored(tile) {
    return Boolean(
      this.explored.find((item) => item.x === tile.x && item.y === tile.y)
    );
  }

  find() {
    this.#isSearching = true;
    const startTile = this.#maze.getStart();

    this.#maze.highlightTile(startTile.x, startTile.y, "green");

    // Add new paths to the queue
    this.frontier.push(...this.#maze.getNeighbors(startTile.x, startTile.y));
    this.explored.push(startTile); // Assuming the start tile is never the goal

    this.step();
  }

  step() {
    if (!this.#isSearching) return; // Search is stopped
    if (!this.frontier.length) {
      // No goal found after search
      console.log("No more tiles and goal not found");
      console.log("Steps taken: " + this.explored.length);
      this.reset();
      return null;
    }

    let currentTile = this.frontier.pop();
  }
}
