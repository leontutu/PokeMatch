import styles from "./ReadyButton.module.css";

type ReadyButtonProps = {
    amIReady: boolean;
    handleReadyClick: () => void;
};

/**
 * A button for players to signal they are ready to start the game.
 * The button is disabled and styled differently when the player is already marked as ready.
 */
export default function ReadyButton({ amIReady, handleReadyClick }: ReadyButtonProps) {
    return (
        <button
            onClick={handleReadyClick}
            className={`${styles.readyBtn} ${amIReady ? styles.pressed : ""}`}
            // disabled={amIReady}
        >
            {amIReady ? "READY!" : "READY?"}
        </button>
    );
}
