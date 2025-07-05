import { displayResult } from "../utils.js";

export class BestFirstSearch {
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

  getOrderedNeighbors(tile) {
    return this.#maze
      .getNeighbors(tile.x, tile.y)
      ?.sort((a, b) => b.manhattanDistance - a.manhattanDistance);
  }

  find() {
    this.#isSearching = true;
    // Show manhattan distances
    this.#maze.updateOptions({ showManhattanDistance: true });
    this.#maze._updateDisplay();

    const startTile = this.#maze.getStart();

    this.#maze.highlightTile(startTile.x, startTile.y, "green");

    // Add new paths to the queue
    // Sort in acsending order first
    const neighbors = this.getOrderedNeighbors(startTile);

    this.frontier.push(...neighbors);
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

        let neighbors = this.getOrderedNeighbors(currentTile);
        neighbors = neighbors.filter(
          (item) => !this.isAlreadyExplored(item) && item.isWalkable()
        );
        this.frontier.push(...neighbors);
      }
      // Move to next step
      this.timeOuts.push(setTimeout(() => this.step(), this.#maze.getSpeed()));
    } else {
      this.step();
    }
  }
}
