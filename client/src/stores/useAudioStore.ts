import { create } from "zustand";
import { Howl } from "howler";

Howler.mute(true); // Start muted

const bgmMenu = new Howl({
  src: ["/audio/music/welcome-to-the-world-of-pokemon.mp3"],
  loop: true,
  volume: 0.5,
  html5: true,
  preload: true,
});

const bgmAncientRuins = new Howl({
  src: ["/audio/music/ancient-ruins.mp3"],
  loop: true,
  html5: true,
});

const bgmBarrenValley = new Howl({
  src: ["/audio/music/barren-valley.mp3"],
  volume: 0.5,
  html5: true,
});

const bgmCraggyCoast = new Howl({
  src: ["/audio/music/craggy-coast.mp3"],
  volume: 0.5,
  html5: true,
});

const bgmDrenchedBluff = new Howl({
  src: ["/audio/music/drenched-bluff.mp3"],
  volume: 0.5,
  html5: true,
});

const bgmSkyPeakCave = new Howl({
  src: ["/audio/music/sky-peak-cave.mp3"],
  volume: 0.5,
  html5: true,
});

const gameBgm = [
  bgmAncientRuins,
  bgmBarrenValley,
  bgmCraggyCoast,
  bgmDrenchedBluff,
  bgmSkyPeakCave,
];

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
    randomBgm.play();
    set({ currentBgm: randomBgm });
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
      volume: 1,
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

    // if (!bgmMenu.playing()) bgmMenu.play();
  },

  setVolume: (val) => {
    set({ volume: val });
    bgmMenu.volume(val);
  },
}));
