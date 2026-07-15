(() => {
  "use strict";

  const SAVE_KEY = "lumenwake-save-v1";
  const SAVE_VERSION = 2;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const refs = {
    title: $("#title-screen"),
    play: $("#play-screen"),
    continueButton: $("#continue-button"),
    sceneFrame: $("#scene-frame"),
    hotspots: $("#hotspots"),
    player: $("#player"),
    nearestHint: $("#nearest-hint"),
    sceneCaption: $("#scene-caption"),
    chapterKicker: $("#chapter-kicker"),
    chapterTitle: $("#chapter-title"),
    goalText: $("#goal-text"),
    courage: $("#courage-value"),
    warmth: $("#warmth-value"),
    sparks: $("#spark-value"),
    soundButton: $("#sound-button"),
    dialogue: $("#dialogue-modal"),
    dialoguePortrait: $("#dialogue-portrait"),
    dialogueSpeaker: $("#dialogue-speaker"),
    dialogueCount: $("#dialogue-count"),
    dialogueText: $("#dialogue-text"),
    dialogueChoices: $("#dialogue-choices"),
    dialogueNext: $("#dialogue-next"),
    battle: $("#battle-modal"),
    battleKicker: $("#battle-kicker"),
    battleTitle: $("#battle-title"),
    battleClose: $(".battle-close"),
    enemyArt: $("#enemy-art"),
    enemyMood: $("#enemy-mood"),
    enemyHpText: $("#enemy-hp-text"),
    enemyHpBar: $("#enemy-hp-bar"),
    battleNarration: $("#battle-narration"),
    battleLog: $("#battle-log"),
    battleCourage: $("#battle-courage-value"),
    battleTurn: $("#battle-turn-label"),
    battleCommands: $("#battle-commands"),
    plumCommandCopy: $("#plum-command-copy"),
    journal: $("#journal-panel"),
    journalClose: $("#journal-close"),
    journalContent: $("#journal-content"),
    saveStatus: $("#save-status"),
    ending: $("#ending-card"),
    endingTitle: $("#ending-title"),
    endingText: $("#ending-text"),
    endingStatline: $("#ending-statline"),
    toast: $("#toast")
  };

  const sceneInfo = {
    attic: {
      kicker: "chapter I · the room that waits",
      title: "The Room That Waits",
      caption: "The house is quiet in the way a held breath is quiet.",
      goal: "Look around the attic. The lamp is already lit.",
      hotspots: [
        { id: "bed", x: 19, y: 63, icon: "⌁", label: "the bed" },
        { id: "desk", x: 77, y: 48, icon: "✎", label: "the desk" },
        { id: "window", x: 53, y: 25, icon: "☾", label: "the window" },
        { id: "mask", x: 30, y: 28, icon: "◒", label: "the fox mask" },
        { id: "chest", x: 86, y: 76, icon: "▣", label: "the chest" },
        { id: "door", x: 7, y: 56, icon: "→", label: "the stair door" }
      ]
    },
    orchard: {
      kicker: "chapter II · where lanterns remember",
      title: "Lantern Orchard",
      caption: "Every fruit is a small moon, and every moon has a name.",
      goal: "Gather three memory sparks for the hollow tree.",
      hotspots: [
        { id: "gate", x: 7, y: 78, icon: "←", label: "back to the house" },
        { id: "lantern", x: 26, y: 39, icon: "✦", label: "the stubborn lantern" },
        { id: "bridge", x: 24, y: 64, icon: "≈", label: "the paper bridge" },
        { id: "basket", x: 64, y: 61, icon: "◌", label: "the fruit basket" },
        { id: "well", x: 78, y: 64, icon: "◉", label: "the wishing well" },
        { id: "tree", x: 67, y: 30, icon: "⌂", label: "the hollow tree" },
        { id: "sign", x: 91, y: 74, icon: "?", label: "the old sign" },
        { id: "sky", x: 50, y: 14, icon: "·", label: "the moon" }
      ]
    },
    tide: {
      kicker: "chapter III · the paper tide",
      title: "The Paper Tide",
      caption: "The red thread does not pull. It only waits to be followed.",
      goal: "Set three memories afloat, then follow the thread.",
      hotspots: [
        { id: "boat-left", x: 28, y: 63, icon: "⌄", label: "a paper boat" },
        { id: "boat-center", x: 51, y: 54, icon: "⌄", label: "another paper boat" },
        { id: "boat-right", x: 64, y: 63, icon: "⌄", label: "the last paper boat" },
        { id: "thread", x: 76, y: 78, icon: "∞", label: "the red thread" },
        { id: "moon", x: 49, y: 17, icon: "☾", label: "the reflected moon" },
        { id: "arch", x: 78, y: 35, icon: "∩", label: "the root arch" }
      ]
    },
    dawn: {
      kicker: "epilogue · a light left on",
      title: "The Orchard at Morning",
      caption: "Some goodbyes are doors. Some are windows. Both let in weather.",
      goal: "Take one last look.",
      hotspots: [
        { id: "dawn-tree", x: 67, y: 30, icon: "⌂", label: "the tree" },
        { id: "dawn-gate", x: 7, y: 78, icon: "←", label: "the path home" }
      ]
    }
  };

  const enemies = {
    gnawer: {
      kicker: "a small encounter · paper bridge",
      title: "The Paper Gnawer",
      mood: "jittery",
      art: "paper-gnawer",
      maxHp: 13,
      guard: 2,
      damage: 3,
      narration: "It has eaten the word you were trying to say.",
      attackText: "The Gnawer folds itself smaller, then bites at your lantern.",
      listenText: "It pauses. Under the crinkling, something sounds like a child saying: wait.",
      victoryText: "The creature opens its mouth. The missing word is still warm."
    },
    bell: {
      kicker: "a small encounter · wishing well",
      title: "The Bell Beneath the Well",
      mood: "echoing",
      art: "bell-hush",
      maxHp: 16,
      guard: 3,
      damage: 3,
      narration: "It rings whenever you get close to the truth.",
      attackText: "A note rolls out of the well and leaves your knees trembling.",
      listenText: "The bell answers with a softer note. It remembers being held.",
      victoryText: "The bell stops ringing. In the quiet, you hear water running uphill."
    },
    unsaid: {
      kicker: "the last page · what stayed behind",
      title: "The Unsaid",
      mood: "waiting",
      art: "unsaid-void",
      maxHp: 23,
      guard: 4,
      damage: 4,
      narration: "It is made from every sentence that stopped at the door.",
      attackText: "The dark reaches for the lantern, not to snuff it out, but to be seen.",
      listenText: "The dark gives back a voice: You were a child. You did not fail her.",
      final: true,
      victoryText: "The Unsaid loosens into a handful of blue moths. The thread goes slack."
    }
  };

  const endings = {
    bright: {
      title: "The Light You Carry",
      text: "Nilo says Mira’s name without asking the night to return it. The orchard does not answer with a miracle. It answers with a path, a warm cup waiting in the kitchen, and Pips humming off-key beside the lantern. The missing page is not filled in. It is finally allowed to turn.",
      statline: "you chose to remember the truth and keep the warmth"
    },
    gentle: {
      title: "A Window Kept Lit",
      text: "Nilo cannot say every part of it yet. That is okay. The paper boats drift until their little lights become stars, and one of them comes back carrying a blank page. Pips says blank pages are not empty. They are patient. On the walk home, Nilo leaves the attic window open.",
      statline: "you made room for the truth, one small sentence at a time"
    },
    unfinished: {
      title: "The Unfinished Song",
      text: "At the root arch, Nilo holds the lantern close and listens. The answer is not a voice from the past; it is the sound of their own breathing. They take the thread home anyway. Tomorrow, perhaps, they will follow it farther. For tonight, the lamp stays on.",
      statline: "you kept walking, even before the words were ready"
    }
  };

  const freshState = () => ({
    version: SAVE_VERSION,
    scene: "attic",
    player: { x: 55, y: 70 },
    courage: 16,
    maxCourage: 16,
    warmth: 0,
    truth: 0,
    sparks: 0,
    tideMemories: 0,
    battleWins: 0,
    sound: true,
    flags: {},
    inventory: [],
    journal: [],
    ending: null,
    startedAt: Date.now()
  });

  let state = freshState();
  let dialogueQueue = [];
  let dialogueIndex = 0;
  let dialogueCurrent = null;
  let dialogueDone = null;
  let battle = null;
  let journalTab = "notes";
  let toastTimer = null;
  let audioContext = null;
  let masterGain = null;
  let musicTimer = null;
  let musicStep = 0;
  const MASTER_VOLUME = .42;
  const WALK_SPEED = 13;
  const APPROACH_SPEED = 42;
  const movementKeys = new Set();
  let movementFrame = null;
  let approachTarget = null;
  let lastMovementTime = 0;
  let lastStepTime = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function finiteNumber(value, fallback, min, max) {
    return typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback;
  }

  function sanitizeFlags(value) {
    if (!isRecord(value)) return {};
    return Object.fromEntries(Object.entries(value)
      .filter(([key, flag]) => key.length <= 80 && (typeof flag === "boolean" || typeof flag === "string" || typeof flag === "number" && Number.isFinite(flag)))
      .slice(0, 120));
  }

  function sanitizeJournal(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(isRecord).map((entry) => ({
      id: typeof entry.id === "string" ? entry.id.slice(0, 80) : "",
      title: typeof entry.title === "string" ? entry.title.slice(0, 180) : "",
      text: typeof entry.text === "string" ? entry.text.slice(0, 1600) : ""
    })).filter((entry) => entry.id && entry.title).slice(0, 100);
  }

  function sanitizeState(parsed) {
    if (!isRecord(parsed) || ![1, SAVE_VERSION].includes(parsed.version)) return null;
    const base = freshState();
    const flags = sanitizeFlags(parsed.flags);
    const ending = typeof parsed.ending === "string" && endings[parsed.ending] ? parsed.ending : null;
    if (parsed.version === 1 && ending && !Object.prototype.hasOwnProperty.call(flags, "endingSeen")) flags.endingSeen = true;
    if (typeof flags.endingSeen !== "boolean" || !ending) delete flags.endingSeen;
    const player = isRecord(parsed.player) ? parsed.player : {};
    const savedScene = typeof parsed.scene === "string" && sceneInfo[parsed.scene] ? parsed.scene : "attic";
    return {
      ...base,
      version: SAVE_VERSION,
      scene: savedScene === "dawn" && !ending ? "attic" : savedScene,
      player: {
        x: finiteNumber(player.x, base.player.x, 4, 96),
        y: finiteNumber(player.y, base.player.y, 8, 88)
      },
      courage: finiteNumber(parsed.courage, base.courage, 0, base.maxCourage),
      warmth: finiteNumber(parsed.warmth, 0, 0, 6),
      truth: finiteNumber(parsed.truth, 0, 0, 8),
      sparks: finiteNumber(parsed.sparks, 0, 0, 3),
      tideMemories: finiteNumber(parsed.tideMemories, 0, 0, 3),
      battleWins: finiteNumber(parsed.battleWins, 0, 0, 99),
      sound: typeof parsed.sound === "boolean" ? parsed.sound : base.sound,
      flags,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory.filter((item) => typeof item === "string" && item.length <= 80).slice(0, 20) : [],
      journal: sanitizeJournal(parsed.journal),
      ending,
      startedAt: finiteNumber(parsed.startedAt, base.startedAt, 0, Number.MAX_SAFE_INTEGER)
    };
  }

  function readSavedState() {
    try {
      return sanitizeState(JSON.parse(localStorage.getItem(SAVE_KEY) || "null"));
    } catch (_) {
      return null;
    }
  }

  function hasSave() {
    return Boolean(readSavedState());
  }

  function saveState(silent = true) {
    try {
      state.version = SAVE_VERSION;
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      if (!silent) {
        refs.saveStatus.textContent = "saved just now";
        window.setTimeout(() => { refs.saveStatus.textContent = "autosaves after every important moment"; }, 2200);
      }
    } catch (_) {
      refs.saveStatus.textContent = "this browser would not keep the note";
    }
  }

  function loadState() {
    const saved = readSavedState();
    if (!saved) {
      try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* no persistent storage available */ }
      return false;
    }
    state = saved;
    return true;
  }

  function updateContinueButton() {
    const enabled = hasSave();
    refs.continueButton.disabled = !enabled;
    refs.continueButton.style.opacity = enabled ? "1" : ".46";
    refs.continueButton.title = enabled ? "Continue your saved walk" : "No saved walk yet";
  }

  function syncSoundButton() {
    refs.soundButton.textContent = state.sound ? "♫" : "·";
    refs.soundButton.title = state.sound ? "Mute sound" : "Turn sound on";
    refs.soundButton.setAttribute("aria-pressed", `${state.sound}`);
  }

  function showToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => refs.toast.classList.remove("show"), 2600);
  }

  function addJournal(id, title, text) {
    if (state.journal.some((entry) => entry.id === id)) return;
    state.journal.push({ id, title, text });
  }

  function addItem(item, quantity = 1, stack = false) {
    if (!stack && state.inventory.includes(item)) return;
    for (let index = 0; index < quantity; index += 1) state.inventory.push(item);
  }

  function itemCount(item) {
    return state.inventory.filter((entry) => entry === item).length;
  }

  function useItem(item) {
    const index = state.inventory.indexOf(item);
    if (index < 0) return false;
    state.inventory.splice(index, 1);
    return true;
  }

  function setFlag(key, value = true) {
    state.flags[key] = value;
  }

  function changeStat(stat, amount, min = 0, max = 99) {
    state[stat] = clamp((state[stat] || 0) + amount, min, max);
    syncHud();
  }

  function awardSpark() {
    if (state.sparks >= 3) return;
    state.sparks += 1;
    syncHud();
    playSfx("spark");
    showToast(`Memory spark found · ${state.sparks} / 3`);
    saveState();
  }

  function syncHud() {
    refs.courage.textContent = `${state.courage}`;
    refs.warmth.textContent = `${state.warmth}`;
    refs.sparks.textContent = `${state.sparks}`;
    refs.goalText.textContent = getGoal();
  }

  function getGoal() {
    if (state.flags.endingSeen) return "The page has turned.";
    if (state.scene === "attic") {
      if (!state.flags.note) return "Look around the attic. The lamp is already lit.";
      if (!state.flags.pips) return "Find out who is hiding in the lantern light.";
      return "Take the red-thread path to Lantern Orchard.";
    }
    if (state.scene === "orchard") {
      if (state.sparks < 3) return `Gather three memory sparks. (${state.sparks} / 3)`;
      return "Bring the sparks to the hollow tree.";
    }
    if (state.scene === "tide") {
      if (state.tideMemories < 3) return `Set the paper memories afloat. (${state.tideMemories} / 3)`;
      return "Follow the red thread to the root arch.";
    }
    if (state.scene === "dawn") return "Take one last look, then follow the path home.";
    return "Take one last look.";
  }

  function renderScene() {
    const info = sceneInfo[state.scene] || sceneInfo.attic;
    refs.sceneFrame.className = `scene-frame scene-${state.scene}`;
    refs.chapterKicker.textContent = info.kicker;
    refs.chapterTitle.textContent = info.title;
    refs.sceneCaption.textContent = info.caption;
    refs.hotspots.innerHTML = "";
    info.hotspots.forEach((hotspot) => {
      if (state.scene === "dawn" && hotspot.id === "dawn-tree" && state.flags.dawnTree) return;
      const button = document.createElement("button");
      button.className = "hotspot";
      button.type = "button";
      button.dataset.hotspot = hotspot.id;
      button.style.left = `${hotspot.x}%`;
      button.style.top = `${hotspot.y}%`;
      button.innerHTML = `<span>${hotspot.icon}</span><span class="hotspot-label">${hotspot.label}</span>`;
      if (hotspotDone(hotspot.id)) button.classList.add("done");
      button.addEventListener("click", () => approachHotspot(hotspot));
      refs.hotspots.appendChild(button);
    });
    updatePlayer();
    syncHud();
  }

  function hotspotDone(id) {
    return Boolean(state.flags[id] || state.flags[`${id}Done`] || (id === "dawn-tree" && state.flags.dawnTree));
  }

  function visibleHotspots() {
    const info = sceneInfo[state.scene] || sceneInfo.attic;
    return info.hotspots.filter((hotspot) => refs.hotspots.querySelector(`[data-hotspot="${hotspot.id}"]`));
  }

  function updatePlayer() {
    state.player.x = clamp(state.player.x, 4, 96);
    state.player.y = clamp(state.player.y, 8, 88);
    refs.player.style.left = `${state.player.x}%`;
    refs.player.style.top = `${state.player.y}%`;
    const nearest = visibleHotspots()
      .map((h) => ({ h, distance: Math.hypot(h.x - state.player.x, h.y - state.player.y) }))
      .sort((a, b) => a.distance - b.distance)[0];
    $$(".hotspot.near").forEach((node) => node.classList.remove("near"));
    if (nearest && nearest.distance < 17 && !dialogueOpen() && !battle && !state.flags.endingSeen) {
      const node = refs.hotspots.querySelector(`[data-hotspot="${nearest.h.id}"]`);
      if (node) node.classList.add("near");
      refs.nearestHint.hidden = false;
      refs.nearestHint.textContent = `E · ${nearest.h.label}`;
      refs.nearestHint.style.left = `${state.player.x}%`;
      refs.nearestHint.style.top = `${state.player.y - 10}%`;
    } else {
      refs.nearestHint.hidden = true;
    }
  }

  function approachHotspot(hotspot) {
    if (dialogueOpen() || battle || !refs.journal.hidden || state.flags.endingSeen) return;
    clearMovement();
    approachTarget = { hotspot, x: hotspot.x, y: clamp(hotspot.y + 8, 8, 88) };
    requestMovementFrame();
  }

  function enterScene(scene, position, lines = null, done = null) {
    state.scene = scene;
    state.player = Object.assign({}, position);
    renderScene();
    saveState();
    if (lines) runDialogue(lines, done);
    else if (done) done();
  }

  function interact(id) {
    if (dialogueOpen() || battle || state.flags.endingSeen) return;
    if (state.scene === "attic") atticInteract(id);
    if (state.scene === "orchard") orchardInteract(id);
    if (state.scene === "tide") tideInteract(id);
    if (state.scene === "dawn") dawnInteract(id);
  }

  function atticInteract(id) {
    if (id === "desk" && !state.flags.note) {
      setFlag("note");
      addItem("Mira's folded note");
      addJournal("note", "Mira's folded note", "Nilo—If the house is quiet, bring the lantern to the orchard. Follow the red thread. Do not go looking for me. Go looking for what we left.");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The paper is warm. It has been waiting under the lamp, but the lamp was not on yesterday." },
        { speaker: "Mira", portrait: "mira", text: "Nilo—If the house is quiet, bring the lantern to the orchard. Follow the red thread. Do not go looking for me. Go looking for what we left." },
        { speaker: "Nilo", portrait: "nilo", text: "A letter that says not to look for someone is still looking." },
        {
          speaker: "Nilo", portrait: "nilo", text: "What do I do with the part that hurts?",
          choices: [
            { label: "Fold the letter gently.", effect: () => changeStat("warmth", 1, 0, 6), after: [{ speaker: "Nilo", portrait: "nilo", text: "I can carry this without squeezing it." }] },
            { label: "Read the last line again.", effect: () => changeStat("truth", 1, 0, 8), after: [{ speaker: "Nilo", portrait: "nilo", text: "The ink breaks where a tear hit it. Mine, probably." }] }
          ]
        }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "window" && !state.flags.pips) {
      setFlag("pips");
      addJournal("pips", "Pips, self-appointed lantern keeper", "A small moth-shaped light with a serious voice. Claims to know where the red thread goes.");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "Something is moving inside the lantern." },
        { speaker: "Pips", portrait: "pips", text: "Something is always moving inside a lantern. Usually the part of you that wants to leave." },
        { speaker: "Nilo", portrait: "nilo", text: "Are you a moth?" },
        { speaker: "Pips", portrait: "pips", text: "I am Pips. Moth-adjacent. Keeper of lost lights, finder of unhelpful doors, and tonight—your escort." },
        { speaker: "Pips", portrait: "pips", text: "Mira tied a red thread from this window to the orchard. It has been waiting for you." },
        { speaker: "Nilo", portrait: "nilo", text: "I thought she stopped waiting." },
        { speaker: "Pips", portrait: "pips", text: "Then perhaps the thread is waiting for a different thing." }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "bed" && !state.flags.bed) {
      setFlag("bed");
      addJournal("bed", "A remembered song", "Nilo remembers the tune Mira used when storms made the roof sound like a drum.");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The blanket still smells like cedar and rain." },
        { speaker: "Nilo", portrait: "nilo", text: "Mira used to tap this bedframe three times before storms. A little song: here, here, here." },
        {
          speaker: "Nilo", portrait: "nilo", text: "The fourth tap never came.", choices: [
            { label: "Tap the frame once.", effect: () => changeStat("warmth", 1, 0, 6), after: [{ speaker: "Pips", portrait: "pips", text: "One is still a beginning." }] },
            { label: "Let the silence stay.", effect: () => changeStat("truth", 1, 0, 8), after: [{ speaker: "Pips", portrait: "pips", text: "Silence can be a room. We can leave it when we are ready." }] }
          ]
        }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "mask" && !state.flags.mask) {
      setFlag("mask");
      addJournal("mask", "The fox mask", "A cardboard fox mask from a play Nilo and Mira made for an audience of two chairs.");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The fox mask has one ear bent. Mira said that made it better at listening." },
        { speaker: "Pips", portrait: "pips", text: "Did it?" },
        { speaker: "Nilo", portrait: "nilo", text: "No. But it made her laugh." },
        {
          speaker: "Nilo", portrait: "nilo", text: "For a moment, the attic looks like a stage.", choices: [
            { label: "Put on the mask.", effect: () => changeStat("warmth", 1, 0, 6), after: [{ speaker: "Nilo", portrait: "nilo", text: "The world is easier to face through a paper face. I will take it off." }] },
            { label: "Leave it on the hook.", effect: () => changeStat("truth", 1, 0, 8), after: [{ speaker: "Nilo", portrait: "nilo", text: "I do not want to hide from the orchard." }] }
          ]
        }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "chest") {
      if (!state.flags.chest && state.flags.note) {
        setFlag("chest");
        addItem("red thread spool");
        addItem("sugar plum", 3, true);
        addJournal("thread", "The red thread", "It is tied around a brass key and smells faintly of oranges. It points out the window.");
        runDialogue([
          { speaker: "Nilo", portrait: "nilo", text: "The chest opens with the key hidden in Mira's paper moon." },
          { speaker: "Pips", portrait: "pips", text: "That is either thoughtful or extremely dramatic." },
          { speaker: "Nilo", portrait: "nilo", text: "She liked both." },
          { speaker: "Nilo", portrait: "nilo", text: "Inside: a spool of red thread, three sugar plums, and a matchbook with only one match left." }
        ], () => { renderScene(); saveState(); });
      } else if (!state.flags.note) {
        runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The chest is locked. The little paper moon beside the lamp looks suspiciously pleased with itself." }]);
      } else {
        runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The chest is empty now, except for the feeling that something important is in my pocket." }]);
      }
      return;
    }
    if (id === "door") {
      if (!state.flags.note) {
        runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The stair door is cold. I should look around before I go." }]);
      } else if (!state.flags.pips) {
        runDialogue([{ speaker: "Pips", portrait: "pips", text: "The orchard is outside, but I am not escorting a person who has not met their own lantern." }]);
      } else {
        const arrival = [
          { speaker: "Nilo", portrait: "nilo", text: "The red thread slips through the crack beneath the door." },
          { speaker: "Pips", portrait: "pips", text: "It goes all the way to the Lantern Orchard. Three sparks are missing from the hollow tree." },
          { speaker: "Nilo", portrait: "nilo", text: "And Mira?" },
          { speaker: "Pips", portrait: "pips", text: "Ask the lanterns. They remember more honestly than people do." }
        ];
        enterScene("orchard", { x: 9, y: 78 }, arrival, () => {
          addJournal("orchard", "The Lantern Orchard", "A garden behind the town where each lantern is named after something people could not say in daylight.");
          saveState();
        });
      }
      return;
    }
    runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "I have looked at this before. It looks back, politely." }]);
  }

  function orchardInteract(id) {
    if (id === "gate") {
      enterScene("attic", { x: 12, y: 64 }, [{ speaker: "Nilo", portrait: "nilo", text: "The attic waits exactly where I left it. That feels less comforting than it should." }]);
      return;
    }
    if (id === "lantern" && !state.flags.lantern) {
      runDialogue([
        { speaker: "Pips", portrait: "pips", text: "This lantern refuses to go out. It has been practicing one question for years." },
        { speaker: "Lantern", portrait: "narrator", text: "Name the part of the night you keep hidden." },
        {
          speaker: "Nilo", portrait: "nilo", text: "The answer catches in my throat.", choices: [
            { label: "I was angry.", effect: () => { changeStat("truth", 2, 0, 8); setFlag("lanternAnswer", "angry"); }, after: [{ speaker: "Lantern", portrait: "narrator", text: "The flame turns blue. Anger is a door that wants to be opened." }] },
            { label: "I was scared.", effect: () => { changeStat("warmth", 1, 0, 6); changeStat("truth", 1, 0, 8); setFlag("lanternAnswer", "scared"); }, after: [{ speaker: "Lantern", portrait: "narrator", text: "The flame turns gold. Fear is a hand asking not to be left alone." }] },
            { label: "I do not know yet.", effect: () => { setFlag("lanternAnswer", "not-yet"); }, after: [{ speaker: "Lantern", portrait: "narrator", text: "The flame stays small. Not knowing is still a shape you can carry." }] }
          ]
        }
      ], () => {
        setFlag("lantern");
        awardSpark();
        addJournal("spark-lantern", "The stubborn lantern", "It asked for the hidden part of the night. The honest answer made a blue-gold spark.");
        renderScene();
        saveState();
      });
      return;
    }
    if (id === "bridge" && !state.flags.bridge) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "Something is chewing on the paper bridge." },
        { speaker: "Pips", portrait: "pips", text: "It is a Gnawer. They eat small words first: sorry, stay, come home." },
        { speaker: "Nilo", portrait: "nilo", text: "Then I will ask it to give one back." }
      ], () => startBattle("gnawer", () => {
        setFlag("bridge");
        awardSpark();
        addJournal("spark-bridge", "The word beneath the bridge", "The Paper Gnawer returned one small word: wait. It was not a command. It was a kindness.");
        runDialogue([{ speaker: "Pips", portrait: "pips", text: "You did not defeat it so much as convince it there was more to eat than fear." }], () => { renderScene(); saveState(); });
      }));
      return;
    }
    if (id === "well" && !state.flags.well) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The well is full of a ringing that does not belong to any bell." },
        { speaker: "Pips", portrait: "pips", text: "The Bell Beneath the Well. It rings whenever someone gets close to a promise." },
        { speaker: "Nilo", portrait: "nilo", text: "I am not sure I made one." },
        { speaker: "Pips", portrait: "pips", text: "That is why it is ringing." }
      ], () => startBattle("bell", () => {
        setFlag("well");
        awardSpark();
        addJournal("spark-well", "The bell beneath the well", "It was not asking for a promise to be kept. It was asking for one to be spoken plainly.");
        runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "I promised I would come back. I just did not promise how soon." }], () => { renderScene(); saveState(); });
      }));
      return;
    }
    if (id === "basket" && !state.flags.basket) {
      setFlag("basket");
      addItem("sugar plum", 1, true);
      addJournal("basket", "A sugar plum", "Mira used to hide sugar plums in every room. This one is still sweet enough to restore 3 courage in an encounter.");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The basket is full of fruit with tiny paper labels: brave, almost, later." },
        { speaker: "Pips", portrait: "pips", text: "Take the one marked later. It is the most useful kind of brave." },
        { speaker: "Nilo", portrait: "nilo", text: "It tastes like orange peel and a decision I have not made yet." }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "tree") {
      if (state.sparks < 3) {
        runDialogue([{ speaker: "Pips", portrait: "pips", text: `The hollow is dark. It needs three sparks. We have ${state.sparks}.` }, { speaker: "Nilo", portrait: "nilo", text: "Then there are still places I have not listened to." }]);
      } else if (!state.flags.tideOpened) {
        setFlag("tideOpened");
        runDialogue([
          { speaker: "Nilo", portrait: "nilo", text: "The three sparks rise from my pocket and settle inside the hollow." },
          { speaker: "Pips", portrait: "pips", text: "The tree is not opening a door. It is remembering one." },
          { speaker: "Nilo", portrait: "nilo", text: "Beyond it: water, paper boats, and the thread." },
          { speaker: "Pips", portrait: "pips", text: "Whatever you find there, do not mistake an answer for a resurrection." }
        ], () => enterScene("tide", { x: 18, y: 78 }, [{ speaker: "Nilo", portrait: "nilo", text: "The inside of the tree is larger than the outside. Mira always liked impossible rooms." }]));
      } else {
        enterScene("tide", { x: 18, y: 78 });
      }
      return;
    }
    if (id === "sign") {
      if (!state.flags.sign) {
        setFlag("sign");
        addJournal("sign", "The old orchard sign", "The sign says: IF YOU ARE LOST, ASK THE THING THAT STAYS. Someone scratched out the word thing and wrote tree.");
        runDialogue([
          { speaker: "Nilo", portrait: "nilo", text: "The sign says: IF YOU ARE LOST, ASK THE THING THAT STAYS." },
          { speaker: "Pips", portrait: "pips", text: "Someone changed thing to tree. People prefer advice that can grow bark." },
          { speaker: "Nilo", portrait: "nilo", text: "What stays?" },
          { speaker: "Pips", portrait: "pips", text: "Not people. Not storms. Sometimes a promise. Sometimes a path." }
        ], () => { renderScene(); saveState(); });
      } else {
        runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The sign has no new advice. It is still trying." }]);
      }
      return;
    }
    if (id === "sky") {
      runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The moon is a paper cutout pinned to the sky. I remember Mira making one like that." }, { speaker: "Pips", portrait: "pips", text: "A copy can still hold a little light." }]);
      return;
    }
    if (id === "lantern" || id === "bridge" || id === "well" || id === "basket") {
      runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The orchard remembers this already." }]);
      return;
    }
    runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "The path is quiet. I can hear my own footsteps trying to become a question." }]);
  }

  function tideInteract(id) {
    if (id === "boat-left" && !state.flags["boat-left"]) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "This boat is folded from a festival flyer. The ink says: ONE NIGHT ONLY — THE MOON PARADE." },
        { speaker: "Mira", portrait: "mira", text: "You promised to come back before the lanterns went out." },
        { speaker: "Nilo", portrait: "nilo", text: "I was on my way. I was just angry that you left first." },
        {
          speaker: "Nilo", portrait: "nilo", text: "The boat waits for a choice.", choices: [
            { label: "Let it float with the truth.", effect: () => { changeStat("truth", 1, 0, 8); setFlag("boat-left-answer", "truth"); }, after: [{ speaker: "Pips", portrait: "pips", text: "The water can hold an honest thing." }] },
            { label: "Warm it with a good memory.", effect: () => { changeStat("warmth", 1, 0, 6); setFlag("boat-left-answer", "warmth"); }, after: [{ speaker: "Pips", portrait: "pips", text: "The water can hold a kind thing too." }] }
          ]
        }
      ], () => { markTideMemory("boat-left", "memory-one", "The festival flyer"); });
      return;
    }
    if (id === "boat-center" && !state.flags["boat-center"]) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The middle boat is made from a grocery list. Apples, soap, a blue ribbon. Mira's handwriting." },
        { speaker: "Mira", portrait: "mira", text: "If the rain gets loud, meet me under the big tree. If I am not there, wait three minutes." },
        { speaker: "Nilo", portrait: "nilo", text: "I waited. Then I went home. Then I told myself I had not been scared." },
        {
          speaker: "Nilo", portrait: "nilo", text: "The paper creases where my thumb presses too hard.", choices: [
            { label: "Open the door in the memory.", effect: () => { changeStat("truth", 2, 0, 8); setFlag("boat-center-answer", "open"); }, after: [{ speaker: "Nilo", portrait: "nilo", text: "I was scared. I went home. Both things are true." }] },
            { label: "Leave the door closed.", effect: () => { changeStat("warmth", 1, 0, 6); setFlag("boat-center-answer", "closed"); }, after: [{ speaker: "Nilo", portrait: "nilo", text: "I can open it later. Later is still a place." }] }
          ]
        }
      ], () => { markTideMemory("boat-center", "memory-two", "The three-minute promise"); });
      return;
    }
    if (id === "boat-right" && !state.flags["boat-right"]) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The last boat is folded from a page torn out of my old sketchbook." },
        { speaker: "Nilo", portrait: "nilo", text: "On it: a picture of two lanterns under the tree. One is mine. The other is only a blank outline." },
        { speaker: "Mira", portrait: "mira", text: "You do not have to keep drawing me in the same place." },
        { speaker: "Nilo", portrait: "nilo", text: "I was trying to make the picture stay." },
        {
          speaker: "Nilo", portrait: "nilo", text: "The blank outline waits for a kinder hand.", choices: [
            { label: "Read the note aloud.", effect: () => { changeStat("truth", 1, 0, 8); setFlag("boat-right-answer", "aloud"); }, after: [{ speaker: "Nilo", portrait: "nilo", text: "Mira, I loved you. I was angry. I am still here." }] },
            { label: "Leave a new drawing.", effect: () => { changeStat("warmth", 2, 0, 6); setFlag("boat-right-answer", "drawing"); }, after: [{ speaker: "Nilo", portrait: "nilo", text: "A small moth beside the lantern. Pips insists it needs better wings." }] }
          ]
        }
      ], () => { markTideMemory("boat-right", "memory-three", "The blank outline"); });
      return;
    }
    if (id === "thread" && !state.flags.thread) {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The red thread is tied around a stone. Mira's knot." },
        { speaker: "Pips", portrait: "pips", text: "That knot says: I was here. It does not say: I am still here." },
        { speaker: "Nilo", portrait: "nilo", text: "I keep looking for the second sentence." },
        { speaker: "Pips", portrait: "pips", text: "Then look at the first one properly." }
      ], () => { setFlag("thread"); addJournal("thread-tide", "The first sentence", "The knot says: I was here. It does not promise that the past will stand up and walk back."); renderScene(); saveState(); });
      return;
    }
    if (id === "moon") {
      runDialogue([{ speaker: "Pips", portrait: "pips", text: "Mira is not waiting at the end of the thread. Waiting is not a person." }, { speaker: "Nilo", portrait: "nilo", text: "Then who am I walking toward?" }, { speaker: "Pips", portrait: "pips", text: "The part of you that stopped walking." }]);
      return;
    }
    if (id === "arch") {
      if (state.tideMemories < 3) {
        runDialogue([{ speaker: "Pips", portrait: "pips", text: "Three boats, Nilo. The water is patient, but even patience likes a shape." }]);
      } else if (!state.flags.finalStarted) {
        setFlag("finalStarted");
        runDialogue([
          { speaker: "Nilo", portrait: "nilo", text: "The red thread leads beneath the root arch." },
          { speaker: "Mira", portrait: "mira", text: "You came back." },
          { speaker: "Nilo", portrait: "nilo", text: "You are not Mira." },
          { speaker: "The Unsaid", portrait: "narrator", text: "I am every word you used to keep her from becoming gone." },
          { speaker: "Pips", portrait: "pips", text: "Then give the words somewhere else to go." }
        ], () => startBattle("unsaid", () => showEnding()));
      } else {
        startBattle("unsaid", () => showEnding());
      }
      return;
    }
    runDialogue([{ speaker: "Nilo", portrait: "nilo", text: "A paper boat drifts past without asking for anything." }]);
  }

  function markTideMemory(flag, journalId, title) {
    setFlag(flag);
    state.tideMemories += 1;
    addJournal(journalId, title, "A memory set afloat. It did not disappear. It became part of the water.");
    playSfx("spark");
    showToast(`A memory is afloat · ${state.tideMemories} / 3`);
    renderScene();
    saveState();
  }

  function dawnInteract(id) {
    if (id === "dawn-tree" && !state.flags.dawnTree) {
      setFlag("dawnTree");
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The hollow tree is only a tree now. The impossible room is folded somewhere behind my ribs." },
        { speaker: "Pips", portrait: "pips", text: "That is a very inconvenient pocket." },
        { speaker: "Nilo", portrait: "nilo", text: "I can live with inconvenient. I am less interested in pretending." }
      ], () => { renderScene(); saveState(); });
      return;
    }
    if (id === "dawn-gate") {
      runDialogue([
        { speaker: "Nilo", portrait: "nilo", text: "The path home is still here. It did not ask me to be finished before I used it." },
        { speaker: "Pips", portrait: "pips", text: "Nothing worth carrying asks that. Go on. The page knows how to turn." }
      ], () => presentEnding());
      return;
    }
    runDialogue([{ speaker: "Pips", portrait: "pips", text: "The morning is not a reward. It is just morning. That is enough." }]);
  }

  function dialogueOpen() {
    return !refs.dialogue.hidden;
  }

  function focusSoon(element) {
    if (!element) return;
    window.requestAnimationFrame(() => {
      try { element.focus({ preventScroll: true }); }
      catch (_) { element.focus(); }
    });
  }

  function activeModal() {
    return [refs.ending, refs.journal, refs.battle, refs.dialogue].find((element) => !element.hidden) || null;
  }

  function trapModalFocus(event) {
    if (event.key !== "Tab") return false;
    const modal = activeModal();
    if (!modal) return false;
    const focusable = [...modal.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
      .filter((element) => element.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); return true; }
    const current = document.activeElement;
    const index = focusable.indexOf(current);
    const next = event.shiftKey ? (index <= 0 ? focusable.length - 1 : index - 1) : (index === focusable.length - 1 ? 0 : index + 1);
    if (index < 0 || next !== index + (event.shiftKey ? -1 : 1)) {
      event.preventDefault();
      focusable[next < 0 ? focusable.length - 1 : next].focus();
      return true;
    }
    return false;
  }

  function runDialogue(entries, done = null) {
    if (!entries || !entries.length) { if (done) done(); return; }
    clearMovement();
    dialogueQueue = entries.slice();
    dialogueIndex = 0;
    dialogueDone = done;
    refs.dialogue.hidden = false;
    renderDialogueEntry();
  }

  function renderDialogueEntry() {
    if (dialogueIndex >= dialogueQueue.length) {
      const done = dialogueDone;
      closeDialogue();
      if (done) done();
      return;
    }
    dialogueCurrent = dialogueQueue[dialogueIndex];
    const entry = dialogueCurrent;
    refs.dialogueSpeaker.textContent = entry.speaker || "";
    refs.dialogueCount.textContent = `${dialogueIndex + 1} / ${dialogueQueue.length}`;
    refs.dialogueText.textContent = entry.text || "";
    refs.dialoguePortrait.className = `dialogue-portrait ${entry.portrait || portraitFor(entry.speaker)}`;
    refs.dialogueChoices.innerHTML = "";
    if (entry.choices) {
      refs.dialogueNext.hidden = true;
      entry.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.type = "button";
        button.textContent = choice.label;
        button.dataset.choice = `${index + 1}`;
        button.addEventListener("click", () => chooseDialogue(index));
        refs.dialogueChoices.appendChild(button);
      });
      focusSoon(refs.dialogueChoices.querySelector("button"));
    } else {
      refs.dialogueNext.hidden = false;
      focusSoon(refs.dialogueNext);
    }
  }

  function portraitFor(speaker) {
    if (speaker === "Pips") return "pips";
    if (speaker === "Mira") return "mira";
    if (speaker === "Nilo") return "nilo";
    return "narrator";
  }

  function advanceDialogue() {
    if (!dialogueCurrent || dialogueCurrent.choices) return;
    dialogueIndex += 1;
    renderDialogueEntry();
  }

  function chooseDialogue(index) {
    if (!dialogueCurrent || !dialogueCurrent.choices) return;
    const choice = dialogueCurrent.choices[index];
    if (!choice) return;
    if (choice.effect) choice.effect();
    saveState();
    if (choice.after && choice.after.length) dialogueQueue.splice(dialogueIndex + 1, 0, ...choice.after);
    dialogueIndex += 1;
    renderDialogueEntry();
    playSfx("click");
  }

  function closeDialogue() {
    refs.dialogue.hidden = true;
    dialogueQueue = [];
    dialogueCurrent = null;
    dialogueDone = null;
    refs.dialogueChoices.innerHTML = "";
  }

  function startBattle(enemyId, onVictory) {
    const template = enemies[enemyId];
    if (!template) return;
    clearMovement();
    battle = {
      id: enemyId,
      enemy: template,
      hp: template.maxHp,
      guard: template.guard,
      turn: "player",
      busy: false,
      mended: false,
      logs: [template.narration],
      onVictory
    };
    refs.battle.hidden = false;
    refs.battleClose.hidden = Boolean(template.final);
    renderBattle();
    focusSoon(refs.battleCommands.querySelector("button:not(:disabled)"));
    initAudio();
    playSfx("encounter");
  }

  function renderBattle() {
    if (!battle) return;
    const e = battle.enemy;
    refs.battleKicker.textContent = e.kicker;
    refs.battleTitle.textContent = e.title;
    refs.enemyArt.className = `enemy-art ${e.art}`;
    refs.enemyArt.setAttribute("aria-label", `${e.title} illustration`);
    refs.enemyMood.textContent = battle.guard > 0 ? e.mood : "heard";
    refs.enemyMood.style.background = battle.guard > 0 ? "var(--teal)" : "var(--gold)";
    refs.enemyHpText.textContent = `${Math.max(0, battle.hp)} / ${e.maxHp}`;
    refs.enemyHpBar.style.width = `${clamp((battle.hp / e.maxHp) * 100, 0, 100)}%`;
    refs.battleNarration.textContent = battle.turn === "enemy" ? e.attackText : e.narration;
    refs.battleLog.textContent = battle.logs.slice(-2).join("  ·  ");
    refs.battleCourage.textContent = `${state.courage} / ${state.maxCourage}`;
    refs.battleTurn.textContent = battle.turn === "player" ? "your turn" : "the feeling moves";
    const plums = itemCount("sugar plum");
    refs.plumCommandCopy.textContent = `restore 3 courage · ${plums ? `${plums} left` : "none left"}`;
    $$("[data-battle-action]").forEach((button) => {
      button.disabled = battle.turn !== "player" || battle.busy;
      if (button.dataset.battleAction === "mend" && battle.mended) button.disabled = true;
      if (button.dataset.battleAction === "plum" && !plums) button.disabled = true;
    });
  }

  function pushBattleLog(message) {
    if (!battle) return;
    battle.logs.push(message);
    if (battle.logs.length > 8) battle.logs.shift();
  }

  function battleAction(action) {
    if (!battle || battle.turn !== "player" || battle.busy || !["listen", "shine", "mend", "name", "plum"].includes(action)) return;
    if (action === "mend" && battle.mended) return;
    if (action === "plum" && !itemCount("sugar plum")) return;
    battle.busy = true;
    const e = battle.enemy;
    let damage = 0;
    let message = "";
    if (action === "listen") {
      const before = battle.guard;
      battle.guard = Math.max(0, battle.guard - 1);
      damage = before === 0 ? 2 : 1;
      changeStat("truth", e.final ? 1 : 0, 0, 8);
      message = e.listenText || (battle.guard === 0 ? "You listen until the sharp edge of it has a name." : "You listen. The feeling stops shouting for a moment.");
      playSfx("listen");
    } else if (action === "shine") {
      damage = battle.guard === 0 ? (e.final ? 7 : 6) : 3;
      message = "You raise the lantern. It does not erase the dark; it gives it edges.";
      playSfx("hit");
    } else if (action === "mend") {
      const heal = 4;
      battle.mended = true;
      state.courage = clamp(state.courage + heal, 0, state.maxCourage);
      changeStat("warmth", 1, 0, 6);
      message = `You mend the little paper lantern. Courage +${heal}.`;
      playSfx("heal");
    } else if (action === "name") {
      const before = battle.guard;
      battle.guard = Math.max(0, battle.guard - 2);
      damage = before === 0 ? (e.final ? 6 : 5) : 2;
      changeStat("truth", 1, 0, 8);
      message = `You say: “${e.title.replace("The ", "").toLowerCase()}.” The name makes room around it.`;
      playSfx("name");
    } else if (action === "plum") {
      useItem("sugar plum");
      const heal = 3;
      state.courage = clamp(state.courage + heal, 0, state.maxCourage);
      message = `The sugar plum tastes like later. Courage +${heal}.`;
      saveState();
      playSfx("heal");
    }
    if (damage > 0) battle.hp -= damage;
    pushBattleLog(`${message}${damage ? ` · ${damage} light` : ""}`);
    syncHud();
    renderBattle();
    if (battle.hp <= 0) {
      window.setTimeout(winBattle, 480);
      return;
    }
    window.setTimeout(enemyTurn, 570);
  }

  function enemyTurn() {
    if (!battle) return;
    const activeBattle = battle;
    const e = battle.enemy;
    battle.turn = "enemy";
    renderBattle();
    const damage = Math.max(1, e.damage);
    state.courage -= damage;
    if (state.courage <= 0) {
      state.courage = Math.min(state.maxCourage, 6);
      pushBattleLog("The lantern goes dark for a moment. You wake outside the encounter with six courage.");
      showToast(`${e.title} remains unresolved. You can return when you are ready.`);
      playSfx("revive");
      syncHud();
      renderBattle();
      saveState();
      window.setTimeout(() => {
        if (battle === activeBattle) loseBattle(activeBattle);
      }, 900);
      return;
    } else {
      pushBattleLog(`${e.title} reaches you · ${damage} courage lost.`);
      playSfx("hurt");
    }
    syncHud();
    renderBattle();
    window.setTimeout(() => {
      if (battle !== activeBattle) return;
      battle.turn = "player";
      battle.busy = false;
      renderBattle();
    }, 560);
  }

  function winBattle() {
    if (!battle) return;
    const finishedBattle = battle;
    const e = finishedBattle.enemy;
    finishedBattle.turn = "player";
    finishedBattle.busy = true;
    pushBattleLog(e.victoryText);
    state.battleWins += 1;
    state.courage = clamp(state.courage + (e.final ? 0 : 3), 0, state.maxCourage);
    playSfx("win");
    syncHud();
    renderBattle();
    refs.battleNarration.textContent = e.victoryText;
    saveState();
    window.setTimeout(() => {
      refs.battle.hidden = true;
      battle = null;
      syncHud();
      if (finishedBattle.onVictory) finishedBattle.onVictory();
    }, 900);
  }

  function fleeBattle() {
    if (!battle || battle.enemy.final) return;
    const name = battle.enemy.title;
    battle = null;
    refs.battle.hidden = true;
    showToast(`You stepped away from ${name}. It is still here if you need to try again.`);
    playSfx("step");
    renderScene();
  }

  function loseBattle(finishedBattle) {
    if (!battle || battle !== finishedBattle) return;
    battle = null;
    refs.battle.hidden = true;
    saveState();
    renderScene();
    focusSoon(refs.hotspots.querySelector(".near") || refs.hotspots.querySelector("button"));
  }

  function showEnding() {
    clearMovement();
    state.ending = state.truth >= 5 && state.warmth >= 3 ? "bright" : state.truth >= 3 ? "gentle" : "unfinished";
    state.scene = "dawn";
    state.player = { x: 28, y: 78 };
    setFlag("finalResolved");
    refs.ending.hidden = true;
    renderScene();
    saveState();
    updateContinueButton();
    runDialogue([
      { speaker: "Narrator", portrait: "narrator", text: "Morning finds the orchard exactly where the night left it, only quieter around the edges." },
      { speaker: "Pips", portrait: "pips", text: "The tree is still here. So is the path home. Take one last look when you are ready." }
    ], () => { renderScene(); saveState(); });
  }

  function presentEnding() {
    if (!state.ending || !endings[state.ending]) return;
    clearMovement();
    const ending = endings[state.ending];
    refs.endingTitle.textContent = ending.title;
    refs.endingText.textContent = ending.text;
    refs.endingStatline.textContent = `${ending.statline} · ${state.battleWins} encounters faced`;
    state.flags.endingSeen = true;
    refs.ending.hidden = false;
    saveState();
    updateContinueButton();
    focusSoon(refs.ending.querySelector("button"));
  }

  function startNewGame() {
    clearMovement();
    closeDialogue();
    battle = null;
    refs.battle.hidden = true;
    state = freshState();
    refs.ending.hidden = true;
    refs.journal.hidden = true;
    refs.title.hidden = true;
    refs.play.hidden = false;
    syncSoundButton();
    initAudio();
    renderScene();
    saveState();
    updateContinueButton();
    runDialogue([
      { speaker: "Narrator", portrait: "narrator", text: "A little before midnight, Nilo wakes to find the attic lamp lit and the moon missing from the sky." },
      { speaker: "Nilo", portrait: "nilo", text: "I did not leave that on." },
      { speaker: "Narrator", portrait: "narrator", text: "In the lantern glass, something small unfolds two bright wings." },
      { speaker: "Pips", portrait: "pips", text: "Your room has been waiting. That is different from your sister waiting." },
      { speaker: "Nilo", portrait: "nilo", text: "Mira?" },
      { speaker: "Pips", portrait: "pips", text: "Follow the red thread. Bring whatever you can say without breaking it." },
      {
        speaker: "Pips", portrait: "pips", text: "Before we go—what will you carry?", choices: [
          { label: "A warm memory.", effect: () => changeStat("warmth", 1, 0, 6), after: [{ speaker: "Nilo", portrait: "nilo", text: "Her laugh, when the cardboard fox fell apart." }] },
          { label: "An honest answer.", effect: () => changeStat("truth", 1, 0, 8), after: [{ speaker: "Nilo", portrait: "nilo", text: "That I was angry she left." }] }
        ]
      },
      { speaker: "Pips", portrait: "pips", text: "Good. The attic has a desk, a window, a bed, and a few things pretending not to matter. Use the arrows or WASD. Press E when something comes close." }
    ], () => {
      setFlag("intro");
      renderScene();
      saveState();
    });
  }

  function continueGame() {
    if (!loadState()) { updateContinueButton(); showToast("That saved page could not be read. Start a new walk."); return; }
    refs.title.hidden = true;
    refs.play.hidden = false;
    refs.ending.hidden = true;
    refs.journal.hidden = true;
    syncSoundButton();
    initAudio();
    renderScene();
    if (state.flags.endingSeen) presentEnding();
    else if (state.ending && state.scene === "dawn") showToast("The morning is still waiting in the orchard.");
    else showToast("The thread remembers where you stopped.");
  }

  function goToTitle() {
    clearMovement();
    refs.ending.hidden = true;
    refs.journal.hidden = true;
    closeDialogue();
    battle = null;
    refs.battle.hidden = true;
    refs.play.hidden = true;
    refs.title.hidden = false;
    updateContinueButton();
    focusSoon($("[data-action='new-game']"));
  }

  function openJournal() {
    clearMovement();
    refs.journal.hidden = false;
    renderJournal();
    focusSoon(refs.journalClose);
  }

  function closeJournal() {
    refs.journal.hidden = true;
    focusSoon($("[data-action='journal']"));
  }

  function renderJournal() {
    $$(".journal-tab").forEach((tab) => {
      const active = tab.dataset.journalTab === journalTab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", `${active}`);
      if (active) refs.journalContent.setAttribute("aria-labelledby", tab.id);
    });
    if (journalTab === "notes") {
      if (!state.journal.length) {
        refs.journalContent.innerHTML = `<div class="journal-entry empty">The page is blank. Blank is not empty. It is patient.</div>`;
      } else {
        refs.journalContent.innerHTML = state.journal.map((entry) => `<article class="journal-entry"><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.text)}</p></article>`).join("");
      }
    } else if (journalTab === "people") {
      refs.journalContent.innerHTML = `
        <article class="journal-entry"><h3>Nilo</h3><p>A child with a lantern, a bent fox mask, and an excellent ability to postpone difficult sentences.</p></article>
        <article class="journal-entry"><h3>Pips</h3><p>A moth-adjacent lantern keeper. Takes every promise literally and every feeling personally.</p></article>
        <article class="journal-entry"><h3>Mira</h3><p>Nilo's older sister. She left behind a red thread and a note that refuses to become an answer.</p></article>`;
    } else {
      const plums = itemCount("sugar plum");
      refs.journalContent.innerHTML = `
        <article class="journal-entry"><h3>Walking</h3><p>Use WASD or the arrow keys to move Nilo. Click a glowing marker to walk there and inspect it. When a marker is close, press E.</p></article>
        <article class="journal-entry"><h3>Encounters</h3><p>Listen lowers an enemy's guard and reveals a weak point. Shine is strongest against an unguarded feeling. Mend restores courage once per encounter. Name it makes a feeling smaller. Keys 1–5 work in battle.</p></article>
        <article class="journal-entry"><h3>Pocket</h3><p>${plums ? `${plums} sugar plum${plums === 1 ? "" : "s"} remain. Use one with key 5 in an encounter to restore 3 courage.` : "No sugar plums remain. The pocket still smells faintly of oranges."}</p></article>
        <article class="journal-entry"><h3>Keeping the page</h3><p>The game autosaves after important moments. Your choices change the final page, but there is no wrong kind of remembering.</p></article>`;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function initAudio() {
    if (!state.sound) {
      if (masterGain) masterGain.gain.value = 0;
      return;
    }
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      audioContext = new AudioCtor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = MASTER_VOLUME;
      masterGain.connect(audioContext.destination);
    }
    if (masterGain) masterGain.gain.value = MASTER_VOLUME;
    if (audioContext.state === "suspended") audioContext.resume();
    if (!musicTimer) {
      musicTimer = window.setInterval(playMusicStep, 2400);
      playMusicStep();
    }
  }

  function oscillator(freq, duration, type = "sine", volume = 0.08, delay = 0) {
    if (!audioContext || !masterGain || !state.sound) return;
    const now = audioContext.currentTime + delay;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + .025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(masterGain);
    osc.start(now);
    osc.stop(now + duration + .03);
  }

  function playMusicStep() {
    if (!audioContext || !state.sound) return;
    const patterns = {
      attic: [[196, 246.94, 293.66], [164.81, 220, 277.18]],
      orchard: [[174.61, 220, 261.63], [146.83, 196, 246.94]],
      tide: [[146.83, 185, 220], [164.81, 207.65, 246.94]],
      dawn: [[196, 246.94, 329.63], [174.61, 220, 293.66]]
    };
    const chord = (patterns[state.scene] || patterns.attic)[musicStep % 2];
    chord.forEach((note, index) => oscillator(note, 2.1, index === 1 ? "triangle" : "sine", .018, index * .05));
    const melody = [392, 440, 493.88, 440, 349.23, 392];
    oscillator(melody[musicStep % melody.length], .72, "sine", .026, .22);
    musicStep += 1;
  }

  function playSfx(kind) {
    if (!audioContext || !state.sound) return;
    const sfx = {
      click: [[520, .09, "triangle", .06, 0]],
      step: [[220, .06, "sine", .025, 0]],
      spark: [[660, .16, "sine", .08, 0], [880, .3, "triangle", .06, .12]],
      encounter: [[110, .3, "sawtooth", .04, 0], [164.81, .3, "triangle", .045, .16]],
      listen: [[293.66, .28, "sine", .06, 0], [369.99, .4, "sine", .04, .16]],
      hit: [[98, .12, "square", .06, 0], [196, .18, "triangle", .05, .09]],
      heal: [[392, .14, "sine", .06, 0], [523.25, .3, "sine", .06, .12]],
      name: [[246.94, .2, "triangle", .06, 0], [329.63, .25, "sine", .05, .12]],
      hurt: [[130.81, .22, "sawtooth", .045, 0]],
      revive: [[174.61, .22, "triangle", .06, 0], [261.63, .4, "sine", .06, .15]],
      win: [[392, .18, "triangle", .06, 0], [493.88, .18, "triangle", .06, .16], [659.25, .42, "sine", .06, .32]]
    };
    (sfx[kind] || []).forEach(([frequency, duration, type, volume, delay]) => oscillator(frequency, duration, type, volume, delay));
  }

  function toggleSound() {
    state.sound = !state.sound;
    syncSoundButton();
    if (state.sound) initAudio();
    else if (masterGain) masterGain.gain.value = 0;
    if (state.sound && masterGain) masterGain.gain.value = MASTER_VOLUME;
    saveState();
  }

  function movementVector() {
    const horizontal = Number(movementKeys.has("d") || movementKeys.has("arrowright")) - Number(movementKeys.has("a") || movementKeys.has("arrowleft"));
    const vertical = Number(movementKeys.has("s") || movementKeys.has("arrowdown")) - Number(movementKeys.has("w") || movementKeys.has("arrowup"));
    const length = Math.hypot(horizontal, vertical);
    return length ? { x: horizontal / length, y: vertical / length } : { x: 0, y: 0 };
  }

  function clearMovement() {
    movementKeys.clear();
    approachTarget = null;
    lastMovementTime = 0;
    lastStepTime = 0;
    if (movementFrame !== null) {
      cancelAnimationFrame(movementFrame);
      movementFrame = null;
    }
  }

  function requestMovementFrame() {
    if (movementFrame !== null) return;
    lastMovementTime = performance.now();
    movementFrame = requestAnimationFrame(stepMovement);
  }

  function stepMovement(now) {
    movementFrame = null;
    if ((!movementKeys.size && !approachTarget) || dialogueOpen() || battle || !refs.journal.hidden || state.flags.endingSeen) {
      lastMovementTime = 0;
      return;
    }
    const elapsed = clamp((now - lastMovementTime) / 1000, 0, .05);
    lastMovementTime = now;
    let direction = movementVector();
    if (approachTarget && !movementKeys.size) {
      const horizontal = approachTarget.x - state.player.x;
      const vertical = approachTarget.y - state.player.y;
      const distance = Math.hypot(horizontal, vertical);
      const distanceThisFrame = APPROACH_SPEED * elapsed;
      if (distance <= Math.max(distanceThisFrame, .1)) {
        const hotspot = approachTarget.hotspot;
        state.player.x = approachTarget.x;
        state.player.y = approachTarget.y;
        approachTarget = null;
        updatePlayer();
        playSfx("step");
        interact(hotspot.id);
        return;
      }
      direction = { x: horizontal / distance, y: vertical / distance };
    }
    state.player.x = clamp(state.player.x + direction.x * WALK_SPEED * elapsed, 4, 96);
    state.player.y = clamp(state.player.y + direction.y * WALK_SPEED * elapsed, 8, 88);
    if (approachTarget && !movementKeys.size) {
      state.player.x = clamp(state.player.x + direction.x * (APPROACH_SPEED - WALK_SPEED) * elapsed, 4, 96);
      state.player.y = clamp(state.player.y + direction.y * (APPROACH_SPEED - WALK_SPEED) * elapsed, 8, 88);
    }
    updatePlayer();
    if (now - lastStepTime > 320) {
      playSfx("step");
      lastStepTime = now;
    }
    if (movementKeys.size || approachTarget) movementFrame = requestAnimationFrame(stepMovement);
  }

  function inspectNearest() {
    if (dialogueOpen() || battle || state.flags.endingSeen) return;
    const nearest = visibleHotspots()
      .map((h) => ({ h, distance: Math.hypot(h.x - state.player.x, h.y - state.player.y) }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest && nearest.distance < 18) interact(nearest.h.id);
    else showToast("Move closer to a glowing marker.");
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    if (trapModalFocus(event)) return;
    if (key === "escape") {
      if (!refs.journal.hidden) { closeJournal(); return; }
      if (dialogueOpen()) { event.preventDefault(); showToast("Finish this conversation to keep the thread."); return; }
      if (battle && !battle.enemy.final) { fleeBattle(); return; }
    }
    if (dialogueOpen()) {
      if (dialogueCurrent && dialogueCurrent.choices && /^[1-4]$/.test(event.key)) { event.preventDefault(); chooseDialogue(Number(event.key) - 1); }
      else if (key === "enter" || key === " ") { event.preventDefault(); advanceDialogue(); }
      return;
    }
    if (battle) {
      if (/^[1-5]$/.test(event.key)) { event.preventDefault(); battleAction(["listen", "shine", "mend", "name", "plum"][Number(event.key) - 1]); }
      return;
    }
    if (!refs.journal.hidden) {
      const focusedTab = document.activeElement.closest && document.activeElement.closest(".journal-tab");
      if (focusedTab && ["arrowleft", "arrowright", "home", "end"].includes(key)) {
        event.preventDefault();
        const tabs = $$(".journal-tab");
        const currentIndex = tabs.indexOf(focusedTab);
        const nextIndex = key === "home" ? 0 : key === "end" ? tabs.length - 1 : (currentIndex + (key === "arrowright" ? 1 : -1) + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];
        journalTab = nextTab.dataset.journalTab;
        renderJournal();
        nextTab.focus();
      }
      return;
    }
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      event.preventDefault();
      approachTarget = null;
      movementKeys.add(key);
      requestMovementFrame();
      return;
    }
    if (key === "e") { event.preventDefault(); inspectNearest(); return; }
    if (key === "j") { event.preventDefault(); openJournal(); }
  }

  function handleKeyup(event) {
    movementKeys.delete(event.key.toLowerCase());
  }

  function handleClick(event) {
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === "new-game") startNewGame();
      if (action === "continue-game") continueGame();
      if (action === "title") goToTitle();
      if (action === "journal") openJournal();
      if (action === "journal-close") closeJournal();
      if (action === "sound") toggleSound();
      if (action === "save-now") { saveState(false); showToast("The page is safe in your pocket."); }
      if (action === "battle-close") fleeBattle();
      return;
    }
    const battleNode = event.target.closest("[data-battle-action]");
    if (battleNode) { battleAction(battleNode.dataset.battleAction); return; }
    const tab = event.target.closest("[data-journal-tab]");
    if (tab) { journalTab = tab.dataset.journalTab; renderJournal(); }
  }

  refs.dialogueNext.addEventListener("click", advanceDialogue);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("click", handleClick);
  document.addEventListener("pointerdown", () => initAudio(), { once: true });
  window.addEventListener("blur", clearMovement);
  window.addEventListener("beforeunload", () => saveState());

  updateContinueButton();
  syncSoundButton();
})();
