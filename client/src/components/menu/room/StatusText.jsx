import styles from "./StatusText.module.css";

/**
 * Displays a status message based on the player's readiness and game state.
 * @param {object} props - The component props.
 * @param {boolean} props.amIReady - Whether the current player is ready.
 * @param {boolean} props.isGameStarted - Whether the game has started.
 * @returns {JSX.Element} The StatusText component.
 */
export default function StatusText({ amIReady, isGameStarted }) {
    return (
        <p
            className={`${styles.statusText} ${
                amIReady && !isGameStarted ? styles.waitingText : ""
            }`}
        >
            {isGameStarted
                ? "Starting Game"
                : amIReady
                ? "Waiting for opponent"
                : "Are you ready?"}
        </p>
    );
}
