import { UI_TEXT } from "../../constants/uiText";
import styles from "./InstructionItem.module.scss";

type InstructionItemProps = {
    instructionHeader: string;
    instructionImage: string;
    instructions: string[];
};

export default function InstructionItem({
    instructionHeader,
    instructionImage,
    instructions,
}: InstructionItemProps) {
    return (
        <div className={styles.outerContainer}>
            <div className={styles.headerSection}>
                <h1 className={styles.instructionHeader}>{instructionHeader}</h1>
            </div>
            <div className={styles.imageSection}>
                <img
                    className={styles.instructionImage}
                    src={instructionImage}
                    alt={UI_TEXT.ALT_TEXT.INSTRUCTION_IMAGE}
                />
            </div>
            <div className={styles.instructionsSection}>
                <ul className={styles.instructionsList}>
                    {instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
