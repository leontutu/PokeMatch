import { create } from "zustand";
import { Howl } from "howler";

Howler.mute(true); // Start muted

// Temporary solution for audio files
const urls = {
  menuBgm:
    "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/vryqittp/003%20-%20Welcome%20to%20the%20World%20of%20Pok%C3%A9mon%21.mp3",
  ancientRuins: "/audio/music/ancient-ruins.mp3",
  barrenValley:
    "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/rewvlsfa/127%20-%20Barren%20Valley.mp3",
  craggyCoast:
    "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/jnklavzn/030%20-%20Craggy%20Coast.mp3",
  drenchedBluff:
    "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/ibhirjwd/012%20-%20Drenched%20Bluff.mp3",
  skyPeakCave:
    "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/abfyzexa/082%20-%20Sky%20Peak%20Cave.mp3",
};

const gameBgm: Howl[] = [];
for (const url in urls) {
  if (url === "menuBgm") continue;
  const bgm = new Howl({
    src: urls[url as keyof typeof urls],
    preload: true,
    html5: true,
    loop: false,
  });

  bgm.on("end", () => {
    bgm.stop();
    useAudioStore.getState().nextBgm();
  });

  gameBgm.push(bgm);
}

const bgmMenu = new Howl({
  src: urls.menuBgm,
  loop: true,
  volume: 0.5,
  html5: true,
  preload: true,
});

const sfxConfirm = new Howl({
  src: ["/audio/sounds/confirm.mp3"],
  volume: 1,
});

const sfxSelect = new Howl({
  src: ["/audio/sounds/select.mp3"],
  volume: 1,
});

const sfxPokeballWiggle = new Howl({
  src: ["/audio/sounds/pokeball-wiggle.mp3"],
  volume: 0.5,
  loop: true,
});

const sfxPokeballPoof = new Howl({
  src: ["/audio/sounds/pokeball-poof.mp3"],
  volume: 1,
});

const sfxNormalEffective = new Howl({
  src: ["/audio/sounds/normal-effective.mp3"],
  volume: 1,
});

const sfxPageTurn1 = new Howl({
  src: ["/audio/sounds/page-turn1.mp3"],
  volume: 0.6,
});

const sfxPageTurn2 = new Howl({
  src: ["/audio/sounds/page-turn2.mp3"],
  volume: 0.3,
});

let pokemonCry: Howl | null = null;

type AudioState = {
  isMuted: boolean;
  volume: number;
  currentBgm: Howl | null;

  stopAllBgm: () => void;
  setBgmVolume: (val: number) => void;
  nextBgm: () => void;

  playMenuBgm: () => void;
  pauseMenuBgm: () => void;
  playGameBgm: () => void;
  pauseGameBgm: () => void;
  playConfirm: () => void;
  playSelect: () => void;
  playPokeballWiggle: () => void;
  stopPokeballWiggle: () => void;
  playPokeballPoof: () => void;
  playPokemonCry: (url: string) => void;
  playNormalEffective: () => void;
  playPageTurn1: () => void;
  playPageTurn2: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: true,
  volume: 1.0,
  currentBgm: null,

  stopAllBgm: () => {
    const currentBgm = get().currentBgm;
    if (currentBgm && currentBgm.playing()) {
      currentBgm.stop();
    }
    bgmMenu.stop();
    set({ currentBgm: null });
  },

  setBgmVolume: (val) => {
    const currentBgm = get().currentBgm;
    if (currentBgm) {
      currentBgm.volume(val);
    }
  },

  playGameBgm: () => {
    bgmMenu.stop();
    if (gameBgm.some((bgm) => bgm.playing())) return;

    const randomBgm = gameBgm[Math.floor(Math.random() * gameBgm.length)];
    set({ currentBgm: randomBgm });
    randomBgm.play();
  },

  nextBgm: () => {
    const randomBgm = gameBgm[Math.floor(Math.random() * gameBgm.length)];
    if (randomBgm === get().currentBgm) {
      return get().nextBgm();
    } else {
      set({ currentBgm: randomBgm });
      randomBgm.play();
    }
  },

  pauseGameBgm: () => {
    const currentBgm = get().currentBgm;
    if (currentBgm && currentBgm.playing()) {
      currentBgm.pause();
    }
    set({ currentBgm: null });
  },

  playMenuBgm: () => {
    if (!bgmMenu.playing()) bgmMenu.play();
  },

  pauseMenuBgm: () => {
    bgmMenu.pause();
  },

  playConfirm: () => {
    sfxConfirm.play();
  },

  playSelect: () => {
    sfxSelect.play();
  },

  playPokeballWiggle: () => {
    sfxPokeballWiggle.play();
  },

  stopPokeballWiggle: () => {
    sfxPokeballWiggle.stop();
  },

  playPokeballPoof: () => {
    sfxPokeballPoof.play();
  },

  playPokemonCry: (url: string) => {
    if (pokemonCry) {
      pokemonCry.unload();
    }
    pokemonCry = new Howl({
      src: [url],
      volume: 0.3,
    });
    pokemonCry.play();
  },

  playNormalEffective: () => {
    sfxNormalEffective.play();
  },

  playPageTurn1: () => {
    sfxPageTurn1.play();
  },

  playPageTurn2: () => {
    sfxPageTurn2.play();
  },

  toggleMute: () => {
    set({ isMuted: !get().isMuted });
    Howler.mute(get().isMuted);
  },

  setVolume: (val) => {
    set({ volume: val });
    bgmMenu.volume(val);
  },
}));
