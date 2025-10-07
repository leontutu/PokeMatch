import InstructionItem from "./InstructionItem";
import styles from "./InstructionPage.module.css";
import { instructionData } from "../../constants/instructionData";

export default function InstructionPage() {
    return (
        <div className={styles.outerContainer}>
            <InstructionItem
                instructionHeader={instructionData[0].instructionHeader}
                instructionImage={instructionData[0].instructionImage}
                instructions={instructionData[0].instructions}
            />
            {/* <InstructionItem
                instructionHeader={instructionData[1].instructionHeader}
                instructionImage={instructionData[1].instructionImage}
                instructions={instructionData[1].instructions}
            />
            <InstructionItem
                instructionHeader={instructionData[2].instructionHeader}
                instructionImage={instructionData[2].instructionImage}
                instructions={instructionData[2].instructions}
            /> */}
            <div className={styles.footer}>
                <span className={styles.pageIndicator}>1 / 3</span>
                <button className={styles.backButton}>Back to Home</button>
            </div>
        </div>
    );
}
