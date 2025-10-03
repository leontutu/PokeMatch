import { useUIInfoContext } from "../../contexts/UIInfoContext.js";
import styles from "./ScreenWipeOverlay.module.css";

export default function ScreenWipeOverlay() {
    const { isWipingIn, isWipingOut } = useUIInfoContext();
    return (
        <>
            {(isWipingOut || isWipingIn) && (
                <div
                    className={`${styles.screenWipeContainer} 
                        ${isWipingOut ? styles.wipeOutActive : ""} 
                        ${isWipingIn ? styles.wipeInActive : ""}
                    `}
                ></div>
            )}
        </>
    );
}
