export function htmlDisplayFunction(tiles, width, height) {
  const mazeEl = document.getElementById("maze");
  if (!mazeEl) return;

  mazeEl.innerHTML = "";
  mazeEl.style.display = "grid";
  mazeEl.style.gridTemplateColumns = `repeat(${width}, 20px)`;
  mazeEl.style.gridTemplateRows = `repeat(${height}, 20px)`;
  mazeEl.style.gap = "1px";

  tiles.forEach((tile) => {
    const div = document.createElement("div");
    div.className = `tile ${tile.type}`;
    div.id = `${tile.x}-${tile.y}`;
    div.style.width = "20px";
    div.style.height = "20px";
    div.dataset.x = tile.x;
    div.dataset.y = tile.y;
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
