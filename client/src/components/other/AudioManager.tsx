import { useEffect } from "react";
import { useSocketContext } from "../../contexts/SocketContext";
import { useNavigationContext } from "../../contexts/NavigationContext";
import { useAudioStore } from "../../stores/useAudioStore";
import { Pages } from "../../constants/constants";

export function AudioManager() {
  const { currentPage } = useNavigationContext();
  const { viewRoom } = useSocketContext();
  const {
    playMenuBgm,
    pauseMenuBgm,
    playGameBgm,
    pauseGameBgm,
    setBgmVolume,
    stopAllBgm,
    isMuted,
  } = useAudioStore();

  useEffect(() => {
    if (isMuted) return;
    if (currentPage === Pages.POKEMON_REVEAL) {
      stopAllBgm();
      return;
    }
    if (viewRoom?.viewGame && currentPage !== Pages.ROOM) {
      pauseMenuBgm();
      playGameBgm();
    } else if (!viewRoom) {
      pauseGameBgm();
      playMenuBgm();
    }
  }, [currentPage, viewRoom, isMuted]);

  return null;
}
