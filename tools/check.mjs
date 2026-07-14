import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredFiles = ["index.html", "styles.css", "game.js", "README.md", "manifest.json"];
const requiredAssets = ["attic-room.png", "lantern-orchard.png", "paper-tide.png", "character-cards.png"];

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) fail(`missing ${file}`);
}

for (const asset of requiredAssets) {
  const path = join(root, "assets", asset);
  if (!existsSync(path)) fail(`missing assets/${asset}`);
  else if (statSync(path).size < 10000) fail(`assets/${asset} is unexpectedly small`);
}

const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "styles.css"), "utf8");
const js = readFileSync(join(root, "game.js"), "utf8");

for (const token of ["title-screen", "play-screen", "dialogue-modal", "battle-modal", "journal-panel", "ending-card"]) {
  if (!html.includes(`id="${token}"`)) fail(`index.html missing ${token}`);
}
for (const asset of requiredAssets) {
  if (!css.includes(`assets/${asset}`)) fail(`styles.css does not reference assets/${asset}`);
}
for (const token of ["startNewGame", "continueGame", "startBattle", "showEnding", "localStorage", "AudioContext"]) {
  if (!js.includes(token)) fail(`game.js missing ${token}`);
}

if (process.exitCode) process.exit();
console.log(`OK: ${requiredFiles.length} core files, ${requiredAssets.length} generated assets, and required game systems are present.`);
