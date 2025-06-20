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
}

const utils = new Utils();
