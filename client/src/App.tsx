import { Pages } from "./constants/constants.js";
import HomePage from "./components/menu/home/HomePage.js";
import EnterNamePage from "./components/menu/enterName/EnterNamePage.js";
import RoomPage from "./components/menu/room/RoomPage.js";
import SelectStatPage from "./components/match/SelectStat/SelectStatPage.js";
import BattlePage from "./components/match/battle/BattlePage.js";
import VictoryPage from "./components/match/victory/VictoryPage.js";
import PokemonRevealPage from "./components/match/reveal/PokemonRevealPage.js";
import { useUIInfoContext } from "./contexts/UIInfoContext.js";
import { useNavigate } from "./hooks/useNavigate.js";
import "./App.css";

function App() {
    const { isWipingIn, isWipingOut } = useUIInfoContext();
    const { currentPage, handleNavigate } = useNavigate();

    const renderPage = () => {
        switch (currentPage) {
            case Pages.HOME:
                return <HomePage onNavigate={handleNavigate} />;
            case Pages.ENTER_NAME:
                return <EnterNamePage onNavigate={handleNavigate} />;
            case Pages.ROOM:
                return <RoomPage />;
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

    return (
        <>
            <div className="page-wrapper">
                {renderPage()}
                {(isWipingOut || isWipingIn) && (
                    <div
                        className={`animation-container 
                            ${isWipingOut ? "wipe-out-active" : ""} 
                            ${isWipingIn ? "wipe-in-active" : ""}
                        `}
                    ></div>
                )}
            </div>
        </>
    );
}
export default App;
