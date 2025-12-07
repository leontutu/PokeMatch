import { create } from "zustand";
import { Howl } from "howler";

const bgm = new Howl({
  src: ["/audio/music/ancient-ruins.mp3"],
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
  playBgm: () => void;
  pauseBgm: () => void;
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
  volume: 0.5,

  playBgm: () => {
    if (!bgm.playing()) bgm.play();
  },

  pauseBgm: () => {
    bgm.pause();
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

    if (!bgm.playing()) bgm.play();
  },

  setVolume: (val) => {
    set({ volume: val });
    bgm.volume(val);
  },
}));
