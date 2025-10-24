import { useNavigationContext } from "./contexts/NavigationContext.js";
import ScreenWipeOverlay from "./components/other/ScreenWipeOverlay.js";
import Router from "./components/other/Router.js";
import { useSocketContext } from "./contexts/SocketContext.js";
import SessionRefusedPage from "./components/warning/SessionRefusedPage.js";
import { UI_TEXT } from "./constants/uiText.js";
import "./App.scss";

function App() {
    const { currentPage } = useNavigationContext();
    const { isConnectionRefused } = useSocketContext();

    return (
        <>
            <div className="pageWrapper">
                {isConnectionRefused ? <SessionRefusedPage /> : <Router page={currentPage} />}
                <ScreenWipeOverlay />
            </div>
            <div className="rotateOverlay">{UI_TEXT.MESSAGES.ROTATE_DEVICE}</div>
        </>
    );
}
export default App;
