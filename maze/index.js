import { DepthFirstSearch } from "./algos/dfs.js";
import { BreadthFirstSearch } from "./algos/bfs.js";
import { Maze } from "./maze.js";
import { clearResult, htmlDisplayFunction } from "./utils.js";
import { BestFirstSearch } from "./algos/best-fs.js";

// Create maze
export const maze = new Maze(20, 15, {
  type: "field",
  wallDensity: 0.3,
  showManhattanDistance: false,
  searchSpeed: 200,
});

// Set display function
maze.setDisplayFunction(htmlDisplayFunction);
maze.randomizeStartGoal();

// Algorithms
const dfs = new DepthFirstSearch(maze);
const dfsRandom = new DepthFirstSearch(maze, true);
const bfs = new BreadthFirstSearch(maze); // breadth first
const bestfs = new BestFirstSearch(maze); // best first

export function stopAllAlgos() {
  dfs.stop();
  dfsRandom.stop();
  bfs.stop();
  bestfs.stop();
  clearResult();
}

export function stopAndRegenerate() {
  stopAllAlgos();
  maze.regenerate();
  maze.randomizeStartGoal(); // Temp
}

// Optional: Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "r":
        event.preventDefault();
        stopAllAlgos();
        maze.regenerate();
        maze.randomizeStartGoal(); // Temp
        break;
      case "s":
        event.preventDefault();
        stopAllAlgos();
        break;
      case "1":
        event.preventDefault();
        stopAllAlgos();
        dfs.find();
        break;
      case "2":
        event.preventDefault();
        stopAllAlgos();
        dfsRandom.find();
        break;
      case "3":
        event.preventDefault();
        stopAllAlgos();
        bfs.find();
        break;
      case "4":
        event.preventDefault();
        stopAllAlgos();
        bestfs.find();
        break;
    }
  }
});
