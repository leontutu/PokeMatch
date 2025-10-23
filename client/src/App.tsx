import { useNavigationContext } from "./contexts/NavigationContext.js";
import ScreenWipeOverlay from "./components/other/ScreenWipeOverlay.js";
import Router from "./components/other/Router.js";
import "./App.scss";
import { useSocketContext } from "./contexts/SocketContext.js";
import SessionRefusedPage from "./components/warning/SessionRefusedPage.js";

function App() {
    const { currentPage } = useNavigationContext();
    const { isConnectionRefused } = useSocketContext();

    return (
        <>
            <div className="page-wrapper">
                {isConnectionRefused ? <SessionRefusedPage /> : <Router page={currentPage} />}
                <ScreenWipeOverlay />
            </div>
        </>
    );
}
export default App;
