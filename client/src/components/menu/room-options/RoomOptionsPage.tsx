import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomOptionsPage.module.scss";
import { useSocketContext } from "../../../contexts/SocketContext";
import { useEffect } from "react";
import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { UI_TEXT } from "../../../constants/uiText";
import { SFX_IDS, useAudioStore } from "../../../stores/useAudioStore";

/**
 * Renders the room options page where users can choose to create a room,
 * join an existing room, or play against a bot.
 *
 * This component provides the primary navigation choices for starting a game.
 * It handles the UI for these options and triggers the corresponding actions,
 * such as creating a room on the server or navigating to the "Enter Room ID" page.
 *
 * @returns {JSX.Element} The rendered room options page.
 */
export default function RoomOptionsPage() {
  const { sendCreateRoom, sendPlayVsBot, viewRoom } = useSocketContext();
  const { handleNavigate } = useNavigationContext();
  const playSfx = useAudioStore((state) => state.playSfx);

  const handleCreateRoomClick = () => {
    sendCreateRoom();
    playSfx(SFX_IDS.MENU_BLIP_1);
  };

  const handleJoinRoomClick = () => {
    handleNavigate(Pages.ENTER_ROOM_ID, false);
    playSfx(SFX_IDS.MENU_BLIP_1);
  };

  const handlePlayVsBotClick = () => {
    sendPlayVsBot();
    playSfx(SFX_IDS.MENU_BLIP_1);
  };

  useEffect(() => {
    if (viewRoom) {
      handleNavigate(Pages.ROOM, false);
    }
  }, [viewRoom, handleNavigate]);

  return (
    <HomeLayout>
      <div className={styles.buttonColumn}>
        <div className={styles.buttonContainer}>
          <button className={styles.createRoomBtn} onClick={handleCreateRoomClick}>
            <span>{UI_TEXT.BUTTONS.CREATE_ROOM}</span>
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.joinRoomBtn} onClick={handleJoinRoomClick}>
            <span>{UI_TEXT.BUTTONS.JOIN_ROOM}</span>
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.playVsBotBtn} onClick={handlePlayVsBotClick}>
            <span>{UI_TEXT.BUTTONS.PLAY_VS_BOT}</span>
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}
