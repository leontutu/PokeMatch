import { Pages } from "./constants/constants.js";
import HomePage from "./components/menu/home/HomePage.js";
import EnterNamePage from "./components/menu/enterName/EnterNamePage.js";
import RoomPage from "./components/menu/room/RoomPage.js";
import SelectStatPage from "./components/match/SelectStat/SelectStatPage.js";
import BattlePage from "./components/match/battle/BattlePage.js";
import VictoryPage from "./components/match/victory/VictoryPage.js";
import PokemonRevealPage from "./components/match/reveal/PokemonRevealPage.js";
import { useUIInfoContext } from "./contexts/UIInfoContext.js";
import { useNavigationContext } from "./contexts/NavigationContext.js";
import "./App.css";

function App() {
    const { isWipingIn, isWipingOut } = useUIInfoContext();
    const { currentPage } = useNavigationContext();

    const renderPage = () => {
        switch (currentPage) {
            case Pages.HOME:
                return <HomePage />;
            case Pages.ENTER_NAME:
                return <EnterNamePage />;
            case Pages.ROOM:
                return <RoomPage />;
            case Pages.SELECT_STAT:
                return <SelectStatPage />;
            case Pages.BATTLE:
                return <BattlePage />;
            case Pages.VICTORY:
                return <VictoryPage />;
            case Pages.POKEMON_REVEAL:
                return <PokemonRevealPage />;
            default:
                return <HomePage />;
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
