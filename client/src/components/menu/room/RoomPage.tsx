import { useState } from "react";
import { useSocketContext } from "../../../contexts/SocketContext";
import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomPage.module.scss";
import ParticipantList from "./ParticipantList";
import ReadyButton from "./ReadyButton";
import StatusText from "./StatusText";
import { addBotToRoom } from "../../../services/apiService";
import { UI_TEXT } from "../../../constants/uiText";
import { SFX_IDS, useAudioStore } from "../../../stores/useAudioStore";

/**
 * Renders the UI for a game room where players wait before a match starts.
 *
 * This component displays the Room ID and a list of participants, showing their
 * ready status. It uses the `useSocketContext` hook to get the current room state and
 * to send a "ready" signal to the server. When the server starts the game,
 * it automatically navigates the user to the next page.
 */
export default function RoomPage() {
  const { viewRoom, toggleReady: sendReady } = useSocketContext();
  const [amIReady, setAmIReady] = useState(false);
  const [vsBotClicked, setVsBotClicked] = useState(false);
  const playSfx = useAudioStore((state) => state.playSfx);

  const handleReadyClick = () => {
    setAmIReady(!amIReady);
    sendReady();
    playSfx(amIReady ? SFX_IDS.UNREADY : SFX_IDS.READY);
  };

  const handleVsBotClick = () => {
    if (!viewRoom || vsBotClicked || viewRoom.viewClientRecords.length > 1) return;
    setVsBotClicked(true);
    addBotToRoom(viewRoom.id);
    playSfx(SFX_IDS.MENU_BLIP_2);
  };

  if (!viewRoom) {
    return <p>{UI_TEXT.MESSAGES.LOADING_ROOM}</p>;
  }

  return (
    <HomeLayout>
      <div className={styles.roomPage}>
        <div className={styles.mainContent}>
          <h1 className={styles.roomTitle}>{UI_TEXT.LABELS.ROOM_ID(viewRoom.id)}</h1>
          <ParticipantList participants={viewRoom.viewClientRecords} />
          <button
            className={`
                        ${styles.addBotButton}
                        ${
                          viewRoom.viewClientRecords.length > 1 || vsBotClicked ? styles.hidden : ""
                        }
                        `}
            onClick={handleVsBotClick}
          >
            {UI_TEXT.BUTTONS.ADD_BOT}
          </button>
        </div>

        <div className={styles.footer}>
          <ReadyButton amIReady={amIReady} handleReadyClick={handleReadyClick} />
          <StatusText amIReady={amIReady} isGameStarted={viewRoom.viewGame !== null} />
        </div>
      </div>
    </HomeLayout>
  );
}
