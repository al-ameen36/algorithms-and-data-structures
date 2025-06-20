const mazeElement = document.getElementById("maze");
const regenerateBtn = document.getElementById("regenerate-button");
const dfsBtn = document.getElementById("dfs-button");
const dfsrBtn = document.getElementById("dfsr-button");
const bfsBtn = document.getElementById("bfs-button");

const xDim = document.getElementById("x-dim");
const yDim = document.getElementById("y-dim");

// Create maze object with custom options
const maze = new Maze([xDim?.value || 20, yDim?.value || 10], mazeElement, {
  wallDensity: 0.4, // More walls
  numPaths: 4, // More branching paths
  pathToGoalChance: 0.8, // Higher chance goal is reachable
});

// initially Generate random maze
maze.regenerate();

// Search Algos
const depthFirstSearch = new DepthFirstSearch(maze);
const depthFirstSearchRandom = new DepthFirstSearchRandom(maze);
const breadthFirstSearchRandom = new BreadthFirstSearch(maze);
const algos = {
  dfs: depthFirstSearch,
  dfsr: depthFirstSearchRandom,
  bfs: breadthFirstSearchRandom,
};

function stopAllAlgorithms() {
  Object.values(algos).forEach((algo) => {
    algo.resetMaze();
    utils.resetHighlighting();
    algo.isSearching = false;
    algo.timeOuts.forEach((timeout) => clearTimeout(timeout));
    algo.timeOuts = [];
  });
}

regenerateBtn.addEventListener("click", () => {
  stopAllAlgorithms();
  maze.regenerate();
});

// Depth first search
dfsBtn?.addEventListener("click", () => {
  stopAllAlgorithms();
  algos["dfs"].findGoal();
});

dfsrBtn?.addEventListener("click", () => {
  stopAllAlgorithms();
  algos["dfsr"].findGoal();
});

// Breadth first search
bfsBtn?.addEventListener("click", () => {
  stopAllAlgorithms();
  algos["bfs"].findGoal();
});
