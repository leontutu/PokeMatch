import styles from "./ReadyButton.module.css";

/**
 * A button for players to signal they are ready to start the game.
 * @param {object} props - The component props.
 * @param {boolean} props.amIReady - Whether the current player is ready.
 * @param {function} props.handleReadyClick - The function to call when the button is clicked.
 * @returns {JSX.Element} The ReadyButton component.
 */
export default function ReadyButton({ amIReady, handleReadyClick }) {
    return (
        <button
            onClick={handleReadyClick}
            className={`${styles.readyBtn} ${amIReady ? styles.pressed : ""}`}
            disabled={amIReady}
        >
            {amIReady ? "READY!" : "READY?"}
        </button>
    );
}
