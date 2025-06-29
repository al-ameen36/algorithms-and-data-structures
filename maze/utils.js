class Utils {
  // highlight tile
  highlightTile(x, y, color) {
    const tileElement = document.getElementById(`${x}-${y}`);
    if (tileElement) tileElement.style.border = "4px solid " + color;
  }

  // reset all highligting
  resetHighlighting() {
    document.querySelectorAll(".tile").forEach((item) => {
      item.style.border = "";
      // if (item.classList.contains("start") || item.classList.contains("start"))
      //   item.classList.remove("start", "goal");
      item.classList.add("path");
    });
  }

  // Shuffle function
  shuffle(array) {
    const temp = [...array];
    const newArray = [];
    while (temp.length) {
      const randomIndex = Math.floor(Math.random() * temp.length);
      newArray.push(...temp.splice(randomIndex, 1));
    }
    return newArray;
  }

  stopAllAlgorithms() {
    Object.values(algos).forEach((algo) => {
      algo.resetMaze();
      if (typeof utils !== "undefined") {
        utils.resetHighlighting();
      }
      algo.isSearching = false;
      if (algo.timeOuts) {
        algo.timeOuts.forEach((timeout) => clearTimeout(timeout));
        algo.timeOuts = [];
      }
    });
  }

  updateMazeDimensions() {
    const newWidth = parseInt(xDim?.value) || 20;
    const newHeight = parseInt(yDim?.value) || 10;

    this.stopAllAlgorithms();
    maze.setDimensions([newWidth, newHeight]);
    maze.regenerate();
  }

  updateMazeType() {
    const newType = mazeTypeSelector?.value || "field";
    this.stopAllAlgorithms();
    maze.setMazeType(newType);
  }
}

const utils = new Utils();
