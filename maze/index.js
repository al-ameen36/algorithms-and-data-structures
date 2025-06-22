const mazeElement = document.getElementById("maze");
const regenerateBtn = document.getElementById("regenerate-button");
const dfsBtn = document.getElementById("dfs-button");
const dfsrBtn = document.getElementById("dfsr-button");
const bfsBtn = document.getElementById("bfs-button");

const xDim = document.getElementById("x-dim");
const yDim = document.getElementById("y-dim");

// Get maze type selector (add this to your HTML if not present)
const mazeTypeSelector = document.getElementById("maze-type-selector");

// Create maze object with custom options
const maze = new Maze(
  [parseInt(xDim?.value) || 20, parseInt(yDim?.value) || 10],
  mazeElement,
  {
    wallDensity: 0.4, // More walls (for field-based mazes)
    numPaths: 4, // More branching paths (for field-based mazes)
    pathToGoalChance: 0.8, // Higher chance goal is reachable
    mazeType: mazeTypeSelector?.value || "field", // Default to field type
  }
);

// Initially generate random maze
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

// Event Listeners
regenerateBtn?.addEventListener("click", () => {
  utils.stopAllAlgorithms();
  maze.regenerate();
});

// Maze type selector (if element exists)
mazeTypeSelector?.addEventListener("change", utils.updateMazeType);

// Dimension inputs (add these listeners if you want real-time updates)
xDim?.addEventListener("change", utils.updateMazeDimensions);
yDim?.addEventListener("change", utils.updateMazeDimensions);

// Search algorithm buttons
dfsBtn?.addEventListener("click", () => {
  utils.stopAllAlgorithms();
  algos["dfs"].findGoal();
});

dfsrBtn?.addEventListener("click", () => {
  utils.stopAllAlgorithms();
  algos["dfsr"].findGoal();
});

bfsBtn?.addEventListener("click", () => {
  utils.stopAllAlgorithms();
  algos["bfs"].findGoal();
});

// Optional: Add keyboard shortcuts
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "r":
        event.preventDefault();
        regenerateBtn?.click();
        break;
      case "1":
        event.preventDefault();
        dfsBtn?.click();
        break;
      case "2":
        event.preventDefault();
        dfsrBtn?.click();
        break;
      case "3":
        event.preventDefault();
        bfsBtn?.click();
        break;
    }
  }
});
