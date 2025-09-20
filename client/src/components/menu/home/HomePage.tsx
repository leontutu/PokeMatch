import { Pages } from "../../../constants/constants";
import HomeLayout from "../layout/HomeLayout";
import styles from "./HomePage.module.css";
import { NavigationHandler } from "../../../types";

type HomePageProps = {
    onNavigate: NavigationHandler;
};

/**
 * Renders the application's main menu screen, providing navigation options.
 *
 * This component displays two primary buttons:
 * - "Match": Navigates the user to the name entry page to begin a game.
 * - "PokéViewer": A placeholder for a future feature, currently disabled.
 *
 * @example
 * <HomePage onNavigate={handleNavigation} />
 */
export default function HomePage({ onNavigate }: HomePageProps) {
    const handleMatchClick = () => {
        onNavigate(Pages.ENTER_NAME, false);
    };

    const handlePokemonClick = () => {
        // note: disabled in current version (0.1)
        return;
        // onNavigate(PAGES.POKEVIEWER, true);
    };

    return (
        <HomeLayout>
            <div className={styles.buttonColumn}>
                <div className={styles.buttonContainer}>
                    <button className={styles.matchBtn} onClick={handleMatchClick}>
                        <span>Match</span>
                    </button>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={handlePokemonClick} className={styles.randomPokemonBtn}>
                        <span>PokéViewer</span>
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}
