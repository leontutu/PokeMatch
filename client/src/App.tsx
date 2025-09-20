import { useState, useEffect, useCallback, useRef } from "react";
import { Pages } from "./constants/constants.js";
import { Timings, GamePhases } from "../../shared/constants/constants.js";
import { useSocket } from "./contexts/SocketContext.jsx";
import { NavigationHandler } from "./types.js";
import HomePage from "./components/menu/home/HomePage.js";
import EnterNamePage from "./components/menu/enterName/EnterNamePage.js";
import RoomPage from "./components/menu/room/RoomPage.js";
import SelectStatPage from "./components/match/SelectStat/SelectStatPage.js";
import BattlePage from "./components/match/battle/BattlePage.js";
import VictoryPage from "./components/match/victory/VictoryPage.js";
import PokemonRevealPage from "./components/match/reveal/PokemonRevealPage.js";

import "./App.css";
import { useSound } from "use-sound";

function App() {
    const audioRef = useRef<HTMLAudioElement>(null);

    // const [currentPage, setCurrentPage] = useState(PAGES.POKEMON_REVEAL);
    const [currentPage, setCurrentPage] = useState(Pages.HOME);

    const [isWipingOut, setIsWipingOut] = useState(false);
    const [isWipingIn, setIsWipingIn] = useState(false);

    const { roomState } = useSocket();

    const { roomCrashSignal } = useSocket();
    const [isFirstRender, setIsFirstRender] = useState(true);

    const [playPageTurn1] = useSound(`/pageTurn1.mp3`, {
        volume: 0.3,
    });
    const [playPageTurn2] = useSound(`/pageTurn2.mp3`, {
        volume: 0.1,
    });

    const handleNavigate: NavigationHandler = useCallback(
        (page: Pages, transition: boolean | undefined) => {
            if (currentPage === page) return;
            audioRef?.current!.play();

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

    const renderPage = () => {
        switch (currentPage) {
            case Pages.HOME:
                return <HomePage onNavigate={handleNavigate} />;
            case Pages.ENTER_NAME:
                return <EnterNamePage onNavigate={handleNavigate} />;
            case Pages.ROOM:
                return <RoomPage onNavigate={handleNavigate} />;
            case Pages.SELECT_STAT:
                return <SelectStatPage onNavigate={handleNavigate} />;
            case Pages.BATTLE:
                return <BattlePage onNavigate={handleNavigate} />;
            case Pages.VICTORY:
                return <VictoryPage onNavigate={handleNavigate} />;
            case Pages.POKEMON_REVEAL:
                return <PokemonRevealPage onNavigate={handleNavigate} />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if (roomCrashSignal) {
            setCurrentPage(Pages.HOME);
            alert("There was an oopsie on the server and your room crashed! Returning to Home...");
        }
    }, [roomCrashSignal, isFirstRender]);

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCKS) {
            handleNavigate(Pages.POKEMON_REVEAL, false);
        }
    }, [handleNavigate]);

    useEffect(() => {
        if (roomState) {
            if (roomState.game) {
                switch (roomState.game.phase) {
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
        }
    }, [roomState, handleNavigate]);

    return (
        <>
            <audio ref={audioRef} src="./ancient_ruins.mp3" loop />
            <div className="page-wrapper">
                {/* The current page is always rendered */}
                {renderPage()}
                {/* The wipe element, visible only during a transition */}
                {(isWipingOut || isWipingIn) && (
                    <div
                        className={`animation-container ${isWipingOut ? "wipe-out-active" : ""} ${
                            isWipingIn ? "wipe-in-active" : ""
                        }`}
                    ></div>
                )}
            </div>
        </>
    );
}
export default App;
