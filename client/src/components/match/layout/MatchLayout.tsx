import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import ScoreBoard from "./ScoreBoard";
import styles from "./MatchLayout.module.scss";
import LeaveConfirmationDialog from "./LeaveConfirmationDialog";
import React from "react";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { UI_TEXT } from "../../../constants/uiText";

type MatchLayoutProps = {
    children: React.ReactNode;
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
export default function MatchLayout({ children }: MatchLayoutProps) {
    const { viewRoom, sendLeaveRoom } = useSocket();
    const { handleNavigate } = useNavigationContext();
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

    if (!viewRoom) return null;

    const handleLeaveConfirm = () => {
        sendLeaveRoom();
        handleNavigate(Pages.HOME, true);
        setIsLeaveDialogOpen(false);
    };

    const handleLeaveCancel = () => {
        setIsLeaveDialogOpen(false);
    };

    const handleOpenDialog = () => {
        setIsLeaveDialogOpen(true);
    };

    if (!viewRoom.viewGame) {
        return <p>{UI_TEXT.MESSAGES.LOADING}</p>;
    }

    return (
        <div className={styles.matchLayout}>
            <div className={styles.contentArea}>{children}</div>
            <ScoreBoard viewGame={viewRoom.viewGame} onHomeClick={handleOpenDialog} />
            <LeaveConfirmationDialog
                isOpen={isLeaveDialogOpen}
                onConfirm={handleLeaveConfirm}
                onCancel={handleLeaveCancel}
            />
        </div>
    );
}
