import { create } from "zustand";
import { Howl, HowlOptions } from "howler";

Howler.mute(true);

export enum SFX_IDS {
  CONFIRM = "confirm",
  SELECT = "select",
  POKEBALL_WIGGLE = "pokeballWiggle",
  POKEBALL_POOF = "pokeballPoof",
  NORMAL_EFFECTIVE = "normalEffective",
  PAGE_TURN_1 = "pageTurn1",
  PAGE_TURN_2 = "pageTurn2",
  MENU_BLIP_1 = "menuBlip1",
  MENU_BLIP_2 = "menuBlip2",
  READY = "ready",
  UNREADY = "unready",
  LEAVE_ROOM = "leaveRoom",
  LEAVE_ROOM2 = "leaveRoom2",
}

// Sound Manifests
const sfxManifest: Record<SFX_IDS, HowlOptions> = {
  [SFX_IDS.CONFIRM]: { src: ["/audio/sounds/confirm.mp3"], volume: 1 },
  [SFX_IDS.SELECT]: { src: ["/audio/sounds/select.mp3"], volume: 1.2 },
  [SFX_IDS.POKEBALL_WIGGLE]: {
    src: ["/audio/sounds/pokeball-wiggle.mp3"],
    volume: 0.5,
    loop: true,
  },
  [SFX_IDS.POKEBALL_POOF]: { src: ["/audio/sounds/pokeball-poof.mp3"], volume: 1 },
  [SFX_IDS.NORMAL_EFFECTIVE]: { src: ["/audio/sounds/normal-effective.mp3"], volume: 1 },
  [SFX_IDS.PAGE_TURN_1]: { src: ["/audio/sounds/page-turn1.mp3"], volume: 0.6 },
  [SFX_IDS.PAGE_TURN_2]: { src: ["/audio/sounds/page-turn2.mp3"], volume: 0.3 },
  [SFX_IDS.MENU_BLIP_1]: { src: ["/audio/sounds/menu-blip1.wav"], volume: 0.5 },
  [SFX_IDS.MENU_BLIP_2]: { src: ["/audio/sounds/menu-blip2.wav"], volume: 1 },
  [SFX_IDS.READY]: { src: ["/audio/sounds/ready.flac"], volume: 1 },
  [SFX_IDS.UNREADY]: { src: ["/audio/sounds/back.wav"], volume: 1 },
  [SFX_IDS.LEAVE_ROOM]: { src: ["/audio/sounds/leave-room.wav"], volume: 1 },
  [SFX_IDS.LEAVE_ROOM2]: { src: ["/audio/sounds/leave-room2.wav"], volume: 1 },
};

const bgmUrls = {
  menu: "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-mystery-dungeon-explorers-of-sky/vryqittp/003%20-%20Welcome%20to%20the%20World%20of%20Pok%C3%A9mon%21.mp3",
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

// Types and Instances
type SfxKey = keyof typeof sfxManifest;

const sfxInstances = Object.fromEntries(
  Object.entries(sfxManifest).map(([key, config]) => [key, new Howl(config)])
) as Record<SFX_IDS, Howl>;

// Initialize BGM Pool
const gameBgm: Howl[] = [];
Object.entries(bgmUrls).forEach(([key, url]) => {
  if (key === "menu") return;
  const bgm = new Howl({ src: url, preload: true, html5: true, loop: false });
  bgm.on("end", () => {
    bgm.stop();
    useAudioStore.getState().nextBgm();
  });
  gameBgm.push(bgm);
});

const menuBgm = new Howl({ src: bgmUrls.menu, loop: true, volume: 0.5, html5: true });

// Store Definition
type AudioState = {
  isMuted: boolean;
  volume: number;
  currentBgm: Howl | null;
  pokemonCry: Howl | null;

  // Simplified Actions
  playSfx: (key: SfxKey) => void;
  stopSfx: (key: SfxKey) => void;
  playPokemonCry: (url: string) => void;

  // BGM Controls
  playMenuBgm: () => void;
  pauseMenuBgm: () => void;
  playGameBgm: () => void;
  pauseGameBgm: () => void;
  nextBgm: () => void;
  stopAllBgm: () => void;

  // Global Controls
  toggleMute: () => void;
  setVolume: (val: number) => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: true,
  volume: 1.0,
  currentBgm: null,
  pokemonCry: null,

  playSfx: (key) => {
    sfxInstances[key].play();
  },

  stopSfx: (key) => {
    sfxInstances[key].stop();
  },

  playPokemonCry: (url) => {
    const prevCry = get().pokemonCry;
    if (prevCry) prevCry.unload();

    const newCry = new Howl({ src: [url], volume: 0.3 });
    set({ pokemonCry: newCry });
    newCry.play();
  },

  playMenuBgm: () => {
    if (!menuBgm.playing()) menuBgm.play();
  },

  pauseMenuBgm: () => menuBgm.pause(),

  playGameBgm: () => {
    menuBgm.stop();
    if (gameBgm.some((bgm) => bgm.playing())) return;
    const randomBgm = gameBgm[Math.floor(Math.random() * gameBgm.length)];
    set({ currentBgm: randomBgm });
    randomBgm.play();
  },

  pauseGameBgm: () => {
    const { currentBgm } = get();
    if (currentBgm?.playing()) currentBgm.pause();
    set({ currentBgm: null });
  },

  nextBgm: () => {
    const randomBgm = gameBgm[Math.floor(Math.random() * gameBgm.length)];
    if (randomBgm === get().currentBgm) {
      return get().nextBgm();
    }
    set({ currentBgm: randomBgm });
    randomBgm.play();
  },

  stopAllBgm: () => {
    const { currentBgm } = get();
    if (currentBgm?.playing()) currentBgm.stop();
    menuBgm.stop();
    set({ currentBgm: null });
  },

  toggleMute: () => {
    const newState = !get().isMuted;
    set({ isMuted: newState });
    Howler.mute(newState);
  },

  setVolume: (val) => {
    set({ volume: val });
    menuBgm.volume(val);
  },
}));
