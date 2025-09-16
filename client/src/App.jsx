import { useState, useEffect, useCallback } from "react";
import { PAGES } from "./constants/constants.js";
import { TIMINGS, GAME_PHASES } from "../../shared/constants/constants.js";
import { useSocket } from "./contexts/SocketContext";
import HomePage from "./components/menu/home/HomePage";
import EnterNamePage from "./components/menu/enterName/EnterNamePage";
import RoomPage from "./components/menu/room/RoomPage";
import MatchLayout from "./components/match/layout/MatchLayout";
import SelectStatPage from "./components/match/SelectStat/SelectStatPage.js";
import BattlePage from "./components/match/battle/BattlePage";
import VictoryPage from "./components/match/victory/VictoryPage";

import "./App.css";

function App() {
    const [currentPage, setCurrentPage] = useState(PAGES.HOME);

    const [isWipingOut, setIsWipingOut] = useState(false);
    const [isWipingIn, setIsWipingIn] = useState(false);

    const { roomState } = useSocket();

    const { roomCrashSignal } = useSocket();
    const [isFirstRender, setIsFirstRender] = useState(true);

    const handleNavigate = useCallback(
        (page, transition) => {
            if (currentPage === page) return;

            if (!transition) {
                setCurrentPage(page);
                return;
            }

            // Start the wipe-out animation.
            setIsWipingOut(true);

            // After the wipe-out animation completes, update the page and start the wipe-in animation.
            setTimeout(() => {
                setCurrentPage(page);
                setIsWipingOut(false);
                setIsWipingIn(true);
            }, TIMINGS.PAGE_TRANSITION); // Must match the wipe-out animation duration

            // After the wipe-in animation completes, reset the state.
            setTimeout(() => {
                setIsWipingIn(false);
            }, 3000); // (Wipe-out duration + wipe-in duration)
        },
        [currentPage]
    );

    const renderPage = () => {
        switch (currentPage) {
            case PAGES.HOME:
                return <HomePage onNavigate={handleNavigate} />;
            case PAGES.ENTER_NAME:
                return <EnterNamePage onNavigate={handleNavigate} />;
            case PAGES.ROOM:
                return <RoomPage onNavigate={handleNavigate} />;
            case PAGES.MATCH_LAYOUT:
                return <MatchLayout />;
            case PAGES.SELECT_STAT:
                return <SelectStatPage onNavigate={handleNavigate} />;
            case PAGES.BATTLE:
                return <BattlePage onNavigate={handleNavigate} />;
            case PAGES.VICTORY:
                return <VictoryPage onNavigate={handleNavigate} />;
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
            setCurrentPage(PAGES.HOME);
            alert(
                "There was an oopsie on the server and your room crashed! Returning to Home..."
            );
        }
    }, [roomCrashSignal, isFirstRender]);

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCKS) {
            handleNavigate(PAGES.ENTER_NAME);
            // handleNavigate(PAGES.ROOM);
        }
    }, [handleNavigate]);

    useEffect(() => {
        if (roomState) {
            if (roomState.game) {
                switch (roomState.game.phase) {
                    case GAME_PHASES.GAME_FINISHED:
                        handleNavigate(PAGES.VICTORY, true);
                        break;
                    case GAME_PHASES.BATTLE:
                        handleNavigate(PAGES.BATTLE, true);
                        break;
                    case GAME_PHASES.SELECT_STAT:
                        handleNavigate(PAGES.SELECT_STAT, true);
                        break;
                }
            }
        }
    }, [roomState, handleNavigate]);

    return (
        <>
            <div className="page-wrapper">
                {/* The current page is always rendered */}
                {renderPage()}
                {/* The wipe element, visible only during a transition */}
                {(isWipingOut || isWipingIn) && (
                    <div
                        className={`animation-container ${
                            isWipingOut ? "wipe-out-active" : ""
                        } ${isWipingIn ? "wipe-in-active" : ""}`}
                    ></div>
                )}
            </div>
        </>
    );
}
export default App;
