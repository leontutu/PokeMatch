import { useUIInfoContext } from "./contexts/UIInfoContext.js";
import { useNavigationContext } from "./contexts/NavigationContext.js";
import Router from "./components/other/Router.js";
import "./App.css";

function App() {
    const { isWipingIn, isWipingOut } = useUIInfoContext();
    const { currentPage } = useNavigationContext();

    return (
        <>
            <div className="page-wrapper">
                <Router page={currentPage} />
                {(isWipingOut || isWipingIn) && (
                    <div
                        className={`screen-wipe-container 
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
