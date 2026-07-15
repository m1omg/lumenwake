import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredFiles = ["index.html", "styles.css", "game.js", "README.md", "manifest.json"];
const requiredAssets = [
  "attic-room.png",
  "lantern-orchard.png",
  "paper-tide.png",
  "character-cards.png",
  "nilo-sprite.png",
  "mira-card.png",
  "paper-gnawer.png",
  "bell-hush.png",
  "unsaid.png"
];

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
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

for (const token of ["title-screen", "play-screen", "dialogue-modal", "battle-modal", "journal-panel", "ending-card"]) {
  if (!html.includes(`id="${token}"`)) fail(`index.html missing ${token}`);
}
for (const asset of requiredAssets) {
  if (!css.includes(`assets/${asset}`)) fail(`styles.css does not reference assets/${asset}`);
}
if (!html.includes('rel="manifest" href="manifest.json"')) fail("index.html does not link the web manifest");
for (const token of ["role=\"dialog\"", "aria-modal=\"true\"", "role=\"tablist\""]) {
  if (!html.includes(token)) fail(`index.html missing accessible ${token}`);
}
if (!css.includes("prefers-reduced-motion")) fail("styles.css is missing a reduced-motion override");
if (!Array.isArray(manifest.icons) || !manifest.icons.some((icon) => icon.src === "assets/mira-card.png")) fail("manifest.json is missing the Lumenwake icon");

for (const token of ["startNewGame", "continueGame", "startBattle", "loseBattle", "showEnding", "presentEnding", "sanitizeState", "approachTarget", "trapModalFocus", "localStorage", "AudioContext"]) {
  if (!js.includes(token)) fail(`game.js missing ${token}`);
}
for (const token of [
  'if (action === "mend" && battle.mended) return;',
  'if (action === "plum" && !itemCount("sugar plum")) return;',
  'const damage = Math.max(1, e.damage);',
  'refs.battleCourage.textContent = `${state.courage} / ${state.maxCourage}`;',
  'if (battle === activeBattle) loseBattle(activeBattle);',
  'if (dialogueOpen()) { event.preventDefault(); showToast("Finish this conversation to keep the thread."); return; }'
]) {
  if (!js.includes(token)) fail(`game.js is missing regression guard: ${token}`);
}

if (process.exitCode) process.exit();
console.log(`OK: ${requiredFiles.length} core files, ${requiredAssets.length} generated assets, PWA metadata, and required game systems are present.`);
