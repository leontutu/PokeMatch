import styles from "./ParticipantList.module.css";

/**
 * Displays a list of participants in the room and their ready status.
 * @param {object} props - The component props.
 * @param {Array<object>} props.participants - The list of participants.
 * @returns {JSX.Element} The ParticipantList component.
 */
export default function ParticipantList({ participants }) {
    return (
        <ul className={styles.participantsList}>
            {participants.map((clientRecord, index) => (
                <li key={index} className={styles.participantItem}>
                    <span className={styles.participantName}>
                        {clientRecord.client.name}
                    </span>
                    <span
                        className={`${styles.statusIndicator} ${
                            clientRecord.isReady ? styles.ready : ""
                        }`}
                    >
                        {clientRecord.isReady ? "Ready" : "Waiting"}
                    </span>
                </li>
            ))}
        </ul>
    );
}
