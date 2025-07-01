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
