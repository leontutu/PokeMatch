import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import HomeLayout from "../layout/HomeLayout";
import styles from "./HomePage.module.scss";
import { UI_TEXT } from "../../../constants/uiText";

/**
 * Renders the application's main menu screen, providing navigation options.
 *
 * This component displays two primary buttons:
 * - "Match": Navigates the user to the name entry page to begin a game.
 * - "PokéViewer": A placeholder for a future feature, currently disabled.
 *
 * @example
 * <HomePage />
 */
export default function HomePage() {
    const { handleNavigate } = useNavigationContext();

    const handleMatchClick = () => {
        handleNavigate(Pages.ENTER_NAME, false);
    };

    const handleHowToPlayClick = () => {
        handleNavigate(Pages.INSTRUCTIONS, true);
    };

    return (
        <HomeLayout>
            <div className={styles.buttonColumn}>
                <div className={styles.buttonContainer}>
                    <button className={styles.matchBtn} onClick={handleMatchClick}>
                        <span>{UI_TEXT.BUTTONS.MATCH}</span>
                    </button>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={handleHowToPlayClick} className={styles.howToPlayBtn}>
                        <span>{UI_TEXT.BUTTONS.HOW_TO_PLAY}</span>
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}
