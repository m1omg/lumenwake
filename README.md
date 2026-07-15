# Lumenwake

Lumenwake is an original, dependency-free browser micro-JRPG about memory, grief, and the small lights people leave for each other. It is built as a static site so it can run locally or on GitHub Pages.

The game is designed as a roughly 35–45 minute first walk, with optional journal entries, a playable dawn epilogue, and three possible final-page variations. Its visual identity uses original hand-drawn scene paintings, distinct character cards for Nilo and Mira, a full-body Nilo sprite, and individual encounter illustrations generated for this project.

## Play locally

```bash
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/>. Opening `index.html` directly is not recommended because browsers can block local asset loading from `file://` pages.

## Controls

- `WASD` or arrow keys: walk at a steady, diagonal-normalized speed
- click a glowing marker: walk to it and inspect it
- `E`: inspect the nearest glowing marker
- `Enter` / `Space`: advance dialogue
- `1`–`5`: choose a dialogue option or battle command; `5` uses a sugar plum when available
- `J`: open the journal
- `Esc`: close the journal or step away from a non-final encounter

The game autosaves important moments in `localStorage`. Sound is synthesized in the browser with the Web Audio API; no external audio files or services are required.

During an encounter, current Courage is shown above the command buttons. Reaching zero ends the encounter, resets that foe for a later retry, and returns Nilo to the scene with 6 Courage; no story progress is awarded.

## Check the build

```bash
node tools/check.mjs
```

The check verifies the core files, every committed art asset, the manifest, accessibility hooks, and the key regression guards for saves, combat, dialogue, and movement.

## Structure

- `index.html` — screens and semantic UI
- `styles.css` — responsive paper-and-ink presentation
- `game.js` — story, exploration, dialogue, combat, save data, journal, and sound
- `assets/` — project-bound generated artwork
- `tools/check.mjs` — lightweight repository integrity check

## Art note

The PNGs in `assets/` were generated with GPT Image 2 through the built-in image generation workflow and then inspected before being integrated. Nilo, Mira, and the three encounter illustrations are project-specific artwork rather than procedural CSS shapes. The game does not use characters, names, music, maps, or plot from any existing title.
