import styles from "./ParticipantList.module.scss";
import { ViewClientRecord } from "../../../../../shared/types/types";
import { UI_TEXT } from "../../../constants/uiText";

type ParticipantListProps = {
    participants: ViewClientRecord[];
};

/**
 * Displays a list of participants in the room and their ready status.
 */
export default function ParticipantList({ participants }: ParticipantListProps) {
    return (
        <ul className={styles.participantsList}>
            {participants.map((viewClientRecord, index) => (
                <li key={index} className={styles.participantItem}>
                    <span className={styles.participantName}>{viewClientRecord.clientName}</span>
                    <span
                        className={`${styles.statusIndicator} ${
                            viewClientRecord.isReady ? styles.ready : ""
                        }`}
                    >
                        {viewClientRecord.isReady
                            ? UI_TEXT.STATUS.CLIENT_READY
                            : UI_TEXT.STATUS.CLIENT_NOT_READY}
                    </span>
                </li>
            ))}
        </ul>
    );
}
