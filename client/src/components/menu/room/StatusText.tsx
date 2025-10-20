import { UI_TEXT } from "../../../constants/uiText";
import styles from "./StatusText.module.scss";

type StatusTextProps = {
    amIReady: boolean;
    isGameStarted: boolean;
};

/**
 * Displays a status message based on the player's readiness and game state.
 */
export default function StatusText({ amIReady, isGameStarted }: StatusTextProps) {
    return (
        <p className={`${styles.statusText} ${amIReady && !isGameStarted ? styles.waitingText : ""}`}>
            {isGameStarted
                ? UI_TEXT.STATUS.GAME_STARTING
                : amIReady
                ? UI_TEXT.STATUS.WAITING_FOR_OPPONENT
                : UI_TEXT.STATUS.ARE_YOU_READY}
        </p>
    );
}
