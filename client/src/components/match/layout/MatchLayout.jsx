/**
 * MatchLayout Component
 *
 * Provides a consistent layout for match pages, including a content area and a scoreboard.
 * Uses styling from MatchLayout.module.css for alignment and spacing.
 * Integrates with the socket context to access room and game state.
 */

import { useSocket } from "../../../contexts/SocketContext";
import ScoreBoard from "./ScoreBoard";
import styles from "./MatchLayout.module.css";

/**
 * MatchLayout functional component.
 * @param {Object} props
 * @param {ReactNode} props.children - The content to render inside the layout.
 * @returns {JSX.Element} The MatchLayout component.
 */
export default function MatchLayout({ children }) {
    const { roomState } = useSocket();

    return (
        <div className={styles.matchLayout}>
            <div className={styles.contentArea}>{children}</div>
            <ScoreBoard game={roomState.game} />
        </div>
    );
}
