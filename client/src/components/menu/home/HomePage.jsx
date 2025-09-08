/**
 * HomePage Component
 *
 * This component renders the application's main menu screen. It provides two primary actions:
 * - "Match": Navigates the user to the name entry page to start a new match.
 * - "PokéViewer": Intended to navigate to a Pokémon viewer feature (currently disabled).
 *
 * Props:
 * - onNavigate (function): Callback to handle navigation between pages. Receives a page constant and an optional parameter.
 *
 * Usage:
 * <HomePage onNavigate={handleNavigate} />
 *
 */

import { PAGES } from "../../../constants/constants";
import HomeLayout from "../layout/HomeLayout";
import styles from "./HomePage.module.css";

/**
 * HomePage functional component.
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle navigation between pages.
 */
export default function HomePage({ onNavigate }) {
    const handleMatchClick = () => {
        onNavigate(PAGES.ENTER_NAME, false);
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
                    <button
                        className={styles.matchBtn}
                        onClick={handleMatchClick}
                    >
                        <span>Match</span>
                    </button>
                </div>
                <div className={styles.buttonContainer}>
                    <button
                        onClick={handlePokemonClick}
                        className={styles.randomPokemonBtn}
                    >
                        <span>PokéViewer</span>
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}
