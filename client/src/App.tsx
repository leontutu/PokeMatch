import { useNavigationContext } from "./contexts/NavigationContext.js";
import ScreenWipeOverlay from "./components/other/ScreenWipeOverlay.js";
import Router from "./components/other/Router.js";
import "./App.scss";

function App() {
    const { currentPage } = useNavigationContext();

    return (
        <>
            <div className="page-wrapper">
                <Router page={currentPage} />
                <ScreenWipeOverlay />
            </div>
        </>
    );
}
export default App;
