import styles from "./InstructionItem.module.css";
import instruction2 from "../../assets/graphics/instruction/instruction-2.png";

export default function InstructionItem() {
    return (
        <div className={styles.outerContainer}>
            <div className={styles.headerSection}>
                <h1 className={styles.instructionHeader}>GET POKEMON</h1>
            </div>
            <div className={styles.imageSection}>
                <img className={styles.instructionImage} src={instruction2} alt="Instruction 2" />
            </div>
            <div className={styles.instructionsSection}>
                <ul className={styles.instructionsList}>
                    <li>
                        Which of your Stats is likely to be higher than the same stat of your opponent?
                    </li>
                    <li>Stats selected by either you or your opponent previously are locked</li>
                    <li>Select your Stat and lock it in by pressing the Choose! Button</li>
                </ul>
            </div>
        </div>
    );
}
