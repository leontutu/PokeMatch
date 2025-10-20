import { useState } from "react";
import styles from "./ReadyButton.module.scss";
import { UI_TEXT } from "../../../constants/uiText";

type ReadyButtonProps = {
    amIReady: boolean;
    handleReadyClick: () => void;
};

/**
 * A button for players to signal they are ready to start the game.
 * The button is disabled and styled differently when the player is already marked as ready.
 */
export default function ReadyButton({ amIReady, handleReadyClick }: ReadyButtonProps) {
    const [canReadyBePressed, setCanReadyBePressed] = useState(true);
    const handleClick = () => {
        if (!canReadyBePressed) return;
        setCanReadyBePressed(false);
        handleReadyClick();
        setTimeout(() => {
            setCanReadyBePressed(true);
        }, 500); // Prevent spamming the ready button
    };

    return (
        <button
            onClick={handleClick}
            className={`${styles.readyBtn} ${amIReady ? styles.pressed : ""}`}
            // disabled={amIReady}
        >
            {amIReady ? UI_TEXT.BUTTONS.READY : UI_TEXT.BUTTONS.NOT_READY}
        </button>
    );
}
