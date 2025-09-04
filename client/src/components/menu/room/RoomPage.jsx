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
 * Renders the room page where players can see each other and ready up for a game.
 * @param {object} props - The component props.
 * @param {function} props.onNavigate - Function to navigate to other pages.
 * @returns {JSX.Element} The RoomPage component.
 */
export default function RoomPage() {
    const { roomState, sendReady } = useSocket();

    //FIXME reconsider this when refactoring gameUtils.js
    // Determine if the current client has already pressed the ready button.
    // const amIReady = roomState.clients.find(
    //     (c) => c.uuid === clientUuid
    // )?.isReady;
    const [amIReady, setAmIReady] = useState(false);

    const handleReadyClick = () => {
        if (!amIReady) {
            setAmIReady(true); //FIXME reconsider this when refactoring gameUtils.js
            sendReady();
        }
    };

    return (
        <HomeLayout>
            <div className={styles.roomPage}>
                <div className={styles.mainContent}>
                    <h1 className={styles.roomTitle}>
                        Room ID: {roomState.id}
                    </h1>
                    <ParticipantList participants={roomState.clientRecords} />
                </div>

                <div className={styles.footer}>
                    <ReadyButton
                        amIReady={amIReady}
                        handleReadyClick={handleReadyClick}
                    />
                    <StatusText
                        amIReady={amIReady}
                        isGameStarted={roomState.game !== null}
                    />
                </div>
            </div>
        </HomeLayout>
    );
}
