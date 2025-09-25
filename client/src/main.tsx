import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { UIInfoProvider } from "./contexts/UIInfoContext.jsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <UIInfoProvider>
                <App />
            </UIInfoProvider>
        </SocketProvider>
    </StrictMode>
);
