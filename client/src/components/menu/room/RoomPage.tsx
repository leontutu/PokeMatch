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

import { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import HomeLayout from "../layout/HomeLayout";
import styles from "./RoomPage.module.css";
import ParticipantList from "./ParticipantList";
import ReadyButton from "./ReadyButton";
import StatusText from "./StatusText";
import { Pages } from "../../../constants/constants";
import { NavigationHandler } from "../../../types";

type RoomPageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Renders the UI for a game room where players wait before a match starts.
 *
 * This component displays the Room ID and a list of participants, showing their
 * ready status. It uses the `useSocket` hook to get the current room state and
 * to send a "ready" signal to the server. When the server starts the game,
 * it automatically navigates the user to the next page.
 */
export default function RoomPage({ onNavigate }: RoomPageProps) {
    const { roomState, sendReady } = useSocket();

    //NOTE reconsider this
    // Determine if the current client has already pressed the ready button.
    // const amIReady = roomState.clients.find(
    //     (c) => c.uuid === clientUuid
    // )?.isReady;
    const [amIReady, setAmIReady] = useState(false);

    useEffect(() => {
        if (roomState?.game) {
            onNavigate(Pages.POKEVIEWER);
        }
    }, [roomState, onNavigate]);

    const handleReadyClick = () => {
        if (!amIReady) {
            setAmIReady(true);
            sendReady();
        }
    };

    if (!roomState) {
        return <p>Loading room...</p>;
    }

    return (
        <HomeLayout>
            <div className={styles.roomPage}>
                <div className={styles.mainContent}>
                    <h1 className={styles.roomTitle}>Room ID: {roomState.id}</h1>
                    <ParticipantList participants={roomState.clientRecords} />
                </div>

                <div className={styles.footer}>
                    <ReadyButton amIReady={amIReady} handleReadyClick={handleReadyClick} />
                    <StatusText amIReady={amIReady} isGameStarted={roomState.game !== null} />
                </div>
            </div>
        </HomeLayout>
    );
}
