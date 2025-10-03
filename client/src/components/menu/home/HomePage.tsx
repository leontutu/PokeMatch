import { Pages } from "../../../constants/constants";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import HomeLayout from "../layout/HomeLayout";
import styles from "./HomePage.module.css";

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

    const handlePokemonClick = () => {
        // note: disabled in current version (0.1)
        return;
        // handleNavigate(PAGES.POKEVIEWER, true);
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
