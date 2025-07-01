import { displayResult } from "../utils.js";

export class BreadthFirstSearch {
  #maze;
  #randomize;
  #isSearching;

  constructor(maze, randomize = false) {
    this.#maze = maze;
    this.#randomize = randomize;

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

    let currentTile = this.frontier.shift();
    if (!this.isAlreadyExplored(currentTile)) {
      // Skip is already explored
      this.explored.push(currentTile); // Keep track of explored tiles

      // Stop searching if current tile is the goal
      if (currentTile.type === "goal") {
        this.#maze.highlightTile(currentTile.x, currentTile.y, "red");
        displayResult(this.explored.length, currentTile);

        this.reset();
        return currentTile;
      }

      // Continue if current tile is not the goal
      else if (currentTile.type === "path") {
        this.#maze.highlightTile(currentTile.x, currentTile.y, "purple");
        let neighbors = this.#maze.getNeighbors(
          currentTile.x,
          currentTile.y,
          this.#randomize
        );
        neighbors = neighbors.filter(
          (item) => !this.isAlreadyExplored(item) && item.isWalkable()
        );
        this.frontier.push(...neighbors);
      }
      // Move to next step
      this.timeOuts.push(setTimeout(() => this.step(), 100));
    } else {
      this.step();
    }
  }
}
