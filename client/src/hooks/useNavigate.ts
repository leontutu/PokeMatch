import { useSocketContext } from "../contexts/SocketContext";
import { useEffect, useState, useCallback } from "react";
import { GamePhases, Timings } from "../../../shared/constants/constants";
import { Pages } from "../constants/constants";
import { NavigationHandler } from "../types";
import { useUIInfoContext } from "../contexts/UIInfoContext";
import { useSound } from "use-sound";
import pageTurn1 from "../assets/audio/sounds/page-turn1.mp3";
import pageTurn2 from "../assets/audio/sounds/page-turn2.mp3";

/**
 * @file Navigation hook for the app.
 *
 * Encapsulates current page state, transition timing and page-turn sound effects.
 * Returns { currentPage, handleNavigate }  NavigationProvider can consume.
 */

export function useNavigate() {
    const { viewRoom, roomCrashSignal } = useSocketContext();
    const phase = viewRoom?.viewGame?.phase;

    const [currentPage, setCurrentPage] = useState(Pages.HOME);
    const { setIsWipingIn, setIsWipingOut } = useUIInfoContext();

    const [playPageTurn1] = useSound(pageTurn1, {
        volume: 0.6,
    });
    const [playPageTurn2] = useSound(pageTurn2, {
        volume: 0.3,
    });

    useEffect(() => {
        if (roomCrashSignal) {
            setCurrentPage(Pages.HOME);
            alert("There was an oopsie on the server and your room crashed! Returning to Home...");
        }
    }, [roomCrashSignal]);

    //NOTE: Consider reafctoring transition logic to a different hook
    const handleNavigate: NavigationHandler = useCallback(
        (page: Pages, transition: boolean | undefined) => {
            if (currentPage === page) return;

            if (!transition) {
                setCurrentPage(page);
                return;
            }

            playPageTurn1();
            setIsWipingOut(true);
            setTimeout(() => {
                playPageTurn2();
                setCurrentPage(page);
                setIsWipingOut(false);
                setIsWipingIn(true);
            }, Timings.PAGE_TRANSITION - 500);

            setTimeout(() => {
                setIsWipingIn(false);
            }, 3000); // (Wipe-out duration + wipe-in duration)
        },
        [currentPage]
    );

    useEffect(() => {
        if (phase) {
            switch (phase) {
                case GamePhases.GAME_FINISHED:
                    handleNavigate(Pages.VICTORY, true);
                    break;
                case GamePhases.BATTLE:
                    handleNavigate(Pages.BATTLE, true);
                    break;
                case GamePhases.SELECT_STAT:
                    handleNavigate(Pages.SELECT_STAT, true);
                    break;
                case GamePhases.POKEMON_REVEAL:
                    handleNavigate(Pages.POKEMON_REVEAL, true);
                    break;
            }
        }
    }, [phase, handleNavigate]);

    return { currentPage, handleNavigate };
}
