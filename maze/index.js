const mazeElement = document.getElementById("maze");
const regenerateBtn = document.getElementById("regenerate-button");
const dfsBtn = document.getElementById("dfs-button");
const dfsrBtn = document.getElementById("dfsr-button");

// Create maze object with custom options
const maze = new Maze([20, 10], mazeElement, {
  wallDensity: 0.4, // More walls
  numPaths: 4, // More branching paths
  pathToGoalChance: 0.8, // Higher chance goal is reachable
});

// initially Generate random maze
maze.regenerate();

regenerateBtn.addEventListener("click", () => {
  maze.regenerate();
  algos["dfs"].searching = false;
});

// Search Algos
const depthFirstSearch = new DepthFirstSearch(maze);
const depthFirstSearchRandom = new DepthFirstSearchRandom(maze);
const algos = {
  dfs: depthFirstSearch,
  dfsr: depthFirstSearchRandom,
};

dfsBtn.addEventListener("click", () => {
  algos["dfs"].resetHighlighting();
  algos["dfs"].findGoal();
});

dfsrBtn.addEventListener("click", () => {
  algos["dfsr"].resetHighlighting();
  algos["dfsr"].findGoal();
});
