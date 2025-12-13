import { useAudioStore } from "../../stores/useAudioStore";
import styles from "./MuteButton.module.scss";
import { Volume2, VolumeX } from "lucide-react";

/**
 * A button that toggles audio mute state.
 * Displays a speaker icon when unmuted and a crossed-out speaker icon when muted.
 */
export default function MuteButton() {
  const isMuted = useAudioStore((state) => state.isMuted);
  const toggleMute = useAudioStore((state) => state.toggleMute);

  return (
    <button
      className={styles.muteButton}
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className={styles.icon} />
      ) : (
        <Volume2 className={styles.icon} />
      )}
    </button>
  );
}
