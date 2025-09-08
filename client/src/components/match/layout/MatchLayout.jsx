/**
 * MatchLayout Component
 *
 * Provides a consistent layout for match pages, including a content area and a scoreboard.
 * Uses styling from MatchLayout.module.css for alignment and spacing.
 * Integrates with the socket context to access room and game state.
 */

import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { PAGES } from "../../../constants/constants";
import ScoreBoard from "./ScoreBoard";
import styles from "./MatchLayout.module.css";
import LeaveConfirmationDialog from "./LeaveConfirmationDialog";

/**
 * MatchLayout functional component.
 * @param {Object} props
 * @param {ReactNode} props.children - The content to render inside the layout.
 * @param {Function} props.onNavigate - Function to handle navigation.
 * @returns {JSX.Element} The MatchLayout component.
 */
export default function MatchLayout({ children, onNavigate }) {
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
