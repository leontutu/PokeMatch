// import { create } from "domain";
import { createServer } from "node:http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import SocketService from "./services/SocketService.js";
import Orchestrator from "./services/Orchestrator.js";
import RoomManager from "./managers/RoomManager.js";
import ClientManager from "./managers/ClientManager.js";
import PokeApiClient from "./clients/PokeAPIClient.js";
import logger from "./utils/Logger.js";
import startBotClient from "./bot-client/botClient.js";
import { isValidRoomId } from "../../shared/utils/validation.js";

const app = express();
const server = createServer(app);

// Instantiate Classes
const roomManager = new RoomManager();
const clientManager = new ClientManager();
const pokeAPIClient = new PokeApiClient();
const orchestrator = new Orchestrator(roomManager, clientManager, pokeAPIClient);
const socketService = new SocketService(server, orchestrator);
orchestrator.setSocketService(socketService);

const PORT = process.env.PORT || `3001`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuildPath = path.join(__dirname, "../../../../client/dist");

app.use(express.static(clientBuildPath));
app.use(express.json());

socketService.init();

app.post("/api/bot/:roomId", (req, res) => {
    if (!isValidRoomId(req.params.roomId)) {
        console.error(`[INDEX] Invalid roomId format received: ${req.params.roomId}`);
        return res.status(400).json({
            error: "Invalid Room ID format. Expected a positive integer.",
        });
    }
    startBotClient(PORT, parseInt(req.params.roomId, 10));
    res.status(200).json({ message: "Bot client started" });
});

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});

server.listen(PORT, () => {
    logger.log("Server is listening on " + PORT);
});
