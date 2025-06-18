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

// Search Algos
const depthFirstSearch = new DepthFirstSearch(maze);
const depthFirstSearchRandom = new DepthFirstSearchRandom(maze);
const algos = {
  dfs: depthFirstSearch,
  dfsr: depthFirstSearchRandom,
};

function stopAllAlgorithms() {
  Object.values(algos).forEach((algo) => {
    algo.resetMaze();
    algo.resetHighlighting();
    algo.isSearching = false;
    algo.timeOuts.forEach((timeout) => clearTimeout(timeout));
    algo.timeOuts = [];
  });
}

regenerateBtn.addEventListener("click", () => {
  stopAllAlgorithms();
  maze.regenerate();
});

dfsBtn.addEventListener("click", () => {
  stopAllAlgorithms();
  algos["dfs"].findGoal();
});

dfsrBtn.addEventListener("click", () => {
  stopAllAlgorithms();
  algos["dfsr"].findGoal();
});
