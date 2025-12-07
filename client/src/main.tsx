import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </SocketProvider>
  </StrictMode>
);
