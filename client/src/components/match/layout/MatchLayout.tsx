import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { PAGES } from "../../../constants/constants";
import ScoreBoard from "./ScoreBoard";
import styles from "./MatchLayout.module.css";
import LeaveConfirmationDialog from "./LeaveConfirmationDialog";
import { NavigationHandler } from "../../../types";
import React from "react";

type MatchLayoutProps = {
    children: React.ReactNode;
    onNavigate: NavigationHandler;
};

/**
 * Provides a consistent layout for all match-related screens.
 *
 * This component wraps the main content of a match, adding a persistent
 * `ScoreBoard` at the bottom. It also manages the "leave room" functionality,
 * handling the confirmation dialog and communicating with the server via the
 * socket context when a user decides to leave.
 *
 * @example
 * <MatchLayout onNavigate={handleNavigation}>
 *   <StatSelectionScreen />
 * </MatchLayout>
 */
export default function MatchLayout({ children, onNavigate }: MatchLayoutProps) {
    const { roomState, sendLeaveRoom } = useSocket();
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

    if (!roomState) return null;

    const handleLeaveConfirm = () => {
        sendLeaveRoom();
        onNavigate(PAGES.HOME, true);
        setIsLeaveDialogOpen(false);
    };

    const handleLeaveCancel = () => {
        setIsLeaveDialogOpen(false);
    };

    const handleOpenDialog = () => {
        setIsLeaveDialogOpen(true);
    };

    if (!roomState.game) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.matchLayout}>
            <div className={styles.contentArea}>{children}</div>
            <ScoreBoard game={roomState.game} onHomeClick={handleOpenDialog} />
            <LeaveConfirmationDialog
                isOpen={isLeaveDialogOpen}
                onConfirm={handleLeaveConfirm}
                onCancel={handleLeaveCancel}
            />
        </div>
    );
}
