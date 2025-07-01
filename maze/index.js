import { DepthFirstSearch } from "./algos/dfs.js";
import { Maze } from "./maze.js";
import { htmlDisplayFunction } from "./utils.js";

// Create maze
const maze = new Maze(20, 15, { type: "line", wallDensity: 0.3 });

// Set display function
maze.setDisplayFunction(htmlDisplayFunction);
maze.randomizeStartGoal();

// Algorithms
const dfs = new DepthFirstSearch(maze);
const dfsRandom = new DepthFirstSearch(maze, true);

// Optional: Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "r":
        event.preventDefault();
        dfs.stop();
        dfsRandom.stop();
        maze.regenerate();
        maze.randomizeStartGoal(); // Temp
        break;
      case "1":
        event.preventDefault();
        dfs.stop();
        dfs.find();
        break;
      case "2":
        event.preventDefault();
        dfsRandom.stop();
        dfsRandom.find();
        break;
    }
  }
});
