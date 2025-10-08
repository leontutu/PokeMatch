/**
 * RoomPage Component
 *
 * Renders the UI for a game room where players can see each other, ready up, and wait for the game to start.
 * Handles local state for the ready button, interacts with the socket context to signal readiness,
 * and navigates to the next page when the game starts.
 *
 * Behavior:
 * - Displays the room ID and a list of participants with their ready status.
 * - Allows the current player to press a "Ready" button to signal readiness.
 * - Shows status text based on readiness and game state.
 * - Navigates to the stat selection page when the game starts.
 *
 * Usage:
 * <RoomPage onNavigate={yourNavigateFunction} />
 */

import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomPage.module.css";
import ParticipantList from "./ParticipantList";
import ReadyButton from "./ReadyButton";
import StatusText from "./StatusText";

/**
 * Renders the UI for a game room where players wait before a match starts.
 *
 * This component displays the Room ID and a list of participants, showing their
 * ready status. It uses the `useSocket` hook to get the current room state and
 * to send a "ready" signal to the server. When the server starts the game,
 * it automatically navigates the user to the next page.
 */
export default function RoomPage() {
    const { viewRoom, toggleReady: sendReady } = useSocket();
    const [amIReady, setAmIReady] = useState(false);
    const [vsBotClicked, setVsBotClicked] = useState(false);

    const handleReadyClick = () => {
        setAmIReady(!amIReady);
        sendReady();
    };

    const handleVsBotClick = () => {
        if (!viewRoom || vsBotClicked || viewRoom.viewClientRecords.length > 1) return;
        setVsBotClicked(true);
        const roomId = viewRoom.id;
        fetch(`/api/bot/${roomId}`, {
            method: "POST",
        });
    };

    if (!viewRoom) {
        return <p>Loading room...</p>;
    }

    return (
        <HomeLayout>
            <div className={styles.roomPage}>
                <div className={styles.mainContent}>
                    <h1 className={styles.roomTitle}>Room ID: {viewRoom.id}</h1>
                    <ParticipantList participants={viewRoom.viewClientRecords} />
                    <button
                        className={`
                        ${styles.addBotButton}
                        ${viewRoom.viewClientRecords.length > 1 || vsBotClicked ? styles.hidden : ""}
                        `}
                        onClick={handleVsBotClick}
                    >
                        ADD BOT
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
