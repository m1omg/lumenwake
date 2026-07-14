# Lumenwake

Lumenwake is an original, dependency-free browser micro-JRPG about memory, grief, and the small lights people leave for each other. It is built as a static site so it can run locally or on GitHub Pages.

The game is designed as a roughly 35–45 minute first walk, with optional journal entries and three possible final-page variations. Its visual identity uses original hand-drawn scene paintings, character cards, and a full-body Nilo sprite generated for this project, with code-drawn enemies layered over them.

## Play locally

```bash
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/>. Opening `index.html` directly is not recommended because browsers can block local asset loading from `file://` pages.

## Controls

- `WASD` or arrow keys: walk at a steady, diagonal-normalized speed
- `E`: inspect the nearest glowing marker
- `Enter` / `Space`: advance dialogue
- `1`–`4`: choose a dialogue option or battle command
- `J`: open the journal
- `Esc`: close a panel or step away from a non-final encounter

The game autosaves important moments in `localStorage`. Sound is synthesized in the browser with the Web Audio API; no external audio files or services are required.

## Structure

- `index.html` — screens and semantic UI
- `styles.css` — responsive paper-and-ink presentation
- `game.js` — story, exploration, dialogue, combat, save data, journal, and sound
- `assets/` — project-bound generated artwork
- `tools/check.mjs` — lightweight repository integrity check

## Art note

The PNGs in `assets/` were generated with GPT Image 2 through the built-in image generation workflow and then inspected before being integrated. The player sprite uses a transparent RGBA cutout rather than procedural CSS shapes. The game does not use characters, names, music, maps, or plot from any existing title.
