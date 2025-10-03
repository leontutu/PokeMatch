import { useUIInfoContext } from "../../contexts/UIInfoContext.js";
import styles from "./ScreenWipeOverlay.module.css";

/**
 * @file Screen wipe overlay.
 *
 * Renders the page wipe overlay (wipe-in / wipe-out) driven by `UIInfoContext`.
 */
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
