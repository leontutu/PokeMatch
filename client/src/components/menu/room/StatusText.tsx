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
            {isGameStarted ? "Starting Game" : amIReady ? "Waiting for opponent" : "Are you ready?"}
        </p>
    );
}
