import { useNavigationContext } from "./contexts/NavigationContext.js";
import ScreenWipeOverlay from "./components/other/ScreenWipeOverlay.js";
import Router from "./components/other/Router.js";
import "./App.scss";
import { useSocket } from "./contexts/SocketContext.real.js";
import SessionRefusedPage from "./components/warning/SessionRefusedPage.js";

function App() {
    const { currentPage } = useNavigationContext();
    const { isConnectionRefused } = useSocket();

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
