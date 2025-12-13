import { useUIStore } from "../../stores/useUIStore";
import styles from "./ScreenWipeOverlay.module.scss";

/**
 * @file Screen wipe overlay.
 *
 * Renders the page wipe overlay (wipe-in / wipe-out) driven by `UIInfoContext`.
 */
export default function ScreenWipeOverlay() {
  const isWipingIn = useUIStore((state) => state.isWipingIn);
  const isWipingOut = useUIStore((state) => state.isWipingOut);

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
