export function htmlDisplayFunction(
  tiles,
  width,
  height,
  showManhattanDistance = false
) {
  const mazeEl = document.getElementById("maze");
  if (!mazeEl) return;

  const tileSize = "25px";

  mazeEl.innerHTML = "";
  mazeEl.style.display = "grid";
  mazeEl.style.gridTemplateColumns = `repeat(${width}, ${tileSize})`;
  mazeEl.style.gridTemplateRows = `repeat(${height}, ${tileSize})`;
  mazeEl.style.gap = "1.5px";

  tiles.forEach((tile) => {
    const div = document.createElement("div");
    div.className = `tile ${tile.type}`;
    div.id = `${tile.x}-${tile.y}`;
    div.style.width = tileSize;
    div.style.height = tileSize;
    div.style.display = "grid";
    div.style.placeItems = "center";
    div.style.fontSize = ".8rem";
    div.dataset.x = tile.x;
    div.dataset.y = tile.y;

    if (showManhattanDistance) {
      if (!["wall", "goal"].includes(tile.type))
        div.innerHTML = tile.manhattanDistance;
    }
    mazeEl.appendChild(div);
  });
}

export function displayResult(steps, goalTile) {
  const resultEl = document.getElementById("result");
  if (resultEl)
    resultEl.innerHTML = `<p>Goal found at x: ${goalTile.x}, y: ${goalTile.y}</p><p>Steps taken: ${steps}</p>`;
}

export function clearResult() {
  const resultEl = document.getElementById("result");
  if (resultEl)
    resultEl.innerHTML = `<p>Goal found at x: -, y: -</p><p>Steps taken: -</p>`;
}
