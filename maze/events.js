import { maze, stopAllAlgos, stopAndRegenerate } from "./index.js";

// Action buttons
const regenerateBtn = document.getElementById("regenerate-button");
const resetBtn = document.getElementById("reset-button");
regenerateBtn.addEventListener("click", () => stopAndRegenerate());
resetBtn.addEventListener("click", () => stopAllAlgos());

// Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("side-toggle");

sidebarToggle.addEventListener("click", () => {
  const pos = sidebar.style.transform;
  if (pos === "translateX(280px)") {
    sidebar.style.transform = "translateX(0px)";
    sidebarToggle.style.transform = "rotateZ(-90deg) translateY(0)";
  } else {
    sidebar.style.transform = "translateX(280px)";
    sidebarToggle.style.transform = "rotateZ(-90deg) translateY(280px)";
  }
});

// Maze options
const mazeTypeSelect = document.getElementById("maze-type-selector");
const xDim = document.getElementById("x-dim");
const yDim = document.getElementById("y-dim");
const wallDensity = document.getElementById("wall-density");
const showDistanceCheckbox = document.getElementById("show-distance");
const updateOptionsBtn = document.getElementById("update-button");

updateOptionsBtn.addEventListener("click", () => {
  maze.updateOptions({
    type: mazeTypeSelect.value,
    wallDensity: wallDensity.value,
    showManhattanDistance: showDistanceCheckbox.checked,
  });
  maze.setDimensions(xDim.value, yDim.value);
  stopAndRegenerate();
});
