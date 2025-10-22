import styles from "./SessionRefusedPage.module.scss";
import { UI_TEXT } from "../../constants/uiText";

export default function SessionRefusedPage() {
    return (
        <div className={styles.outerContainer}>
            <WarningBanner />
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>{UI_TEXT.WARNINGS.CONNECTION_REFUSED}</h1>
                <ul className={styles.messageList}>
                    <li className={styles.message}>{UI_TEXT.WARNINGS.SESSION_REFUSED_MESSAGE_A}</li>
                    <li className={styles.message}>{UI_TEXT.WARNINGS.SESSION_REFUSED_MESSAGE_B}</li>
                    <li className={styles.message}>{UI_TEXT.WARNINGS.SESSION_REFUSED_MESSAGE_C}</li>
                </ul>
            </div>
            <WarningBanner />
        </div>
    );
}

export function WarningBanner() {
    return (
        <div className={styles.warningBanner}>
            <span className={styles.warningText}>{UI_TEXT.WARNINGS.WARNING}</span>
        </div>
    );
}
