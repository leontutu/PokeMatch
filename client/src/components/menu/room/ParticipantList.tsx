import styles from "./ParticipantList.module.css";
import { ClientRecord } from "../../../types";

type ParticipantListProps = {
    participants: ClientRecord[];
};

/**
 * Displays a list of participants in the room and their ready status.
 */
export default function ParticipantList({ participants }: ParticipantListProps) {
    return (
        <ul className={styles.participantsList}>
            {participants.map((clientRecord, index) => (
                <li key={index} className={styles.participantItem}>
                    <span className={styles.participantName}>{clientRecord.client.name}</span>
                    <span
                        className={`${styles.statusIndicator} ${
                            clientRecord.isReady ? styles.ready : ""
                        }`}
                    >
                        {clientRecord.isReady ? "Ready" : "Not Ready"}
                    </span>
                </li>
            ))}
        </ul>
    );
}
