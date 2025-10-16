import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { UIInfoProvider } from "./contexts/UIInfoContext.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.js";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <UIInfoProvider>
                <NavigationProvider>
                    <App />
                </NavigationProvider>
            </UIInfoProvider>
        </SocketProvider>
    </StrictMode>
);
