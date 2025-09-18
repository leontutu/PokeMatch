# PokeMatch

PokeMatch is a real-time, two-player Pokémon-themed card matching game. Players join a room, get ready, and then face off in a battle where they must choose the best stat from their presented Pokémon to win the round.

This is a portfolio project designed to showcase modern web development skills, including React for the front-end, Node.js for the back-end, and WebSocket communication for a seamless, real-time multiplayer experience.

## Features

### Client-Side (React)

*   **Modern React Architecture**: Leverages the latest React features, including functional components and hooks, to create a declarative and efficient user interface.
*   **Encapsulated State Management**: Utilizes React Context and a custom `useSocket` hook to provide a clean, centralized facade for managing global application state and WebSocket interactions, promoting a clear separation of concerns.
*   **Separation of Logic and View**: Employs custom hooks like [`useBattleLogic`](client/src/hooks/useBattleLogic.js) to encapsulate complex business logic, keeping presentational components lean and focused solely on rendering.
*   **Modular & Reusable UI**: A highly modular UI built with granular components, each with its own encapsulated styles via CSS Modules to ensure maintainability and prevent style collisions.
*   **Fluid User Experience**: Implements polished, hardware-accelerated CSS animations and transitions for seamless navigation and engaging in-game events.
*   **Persistent Client Sessions**: Enables players to seamlessly reconnect to their game session using a persistent UUID stored in local storage.

### Server-Side (Node.js & Express)

*   **Object-Oriented & SOLID Design**: Architected using Object-Oriented principles, with a clear separation of concerns that adheres to SOLID principles (e.g., Single Responsibility in managers like [`RoomManager`](server/src/managers/RoomManager.js) and [`ClientManager`](server/src/managers/ClientManager.js)).
*   **Centralized Orchestration**: A main [`Orchestrator`](server/src/services/Orchestrator.js) class acts as a mediator, encapsulating the complex interactions between different services and managers, which simplifies the overall application flow.
*   **Command Pattern for Game Logic**: Decouples game logic execution from the invoker using the Command Pattern. Client actions are encapsulated as command objects and processed by the core [`Game`](server/src/models/Game.js) model, enhancing flexibility and testability.
*   **Observer Pattern for State Changes**: Implements the Observer pattern using Node.js's `EventEmitter` for decoupled, event-driven communication. The core [`Game`](server/src/models/Game.js) model acts as a subject, emitting state change events. These events propagated up to the [`Orchestrator`](server/src/services/Orchestrator.js), ensuring a clear, streamlined data flow from the game logic to the application layer.

*   **Robust Room and Session Management**: A stateful server that manages isolated game rooms and handles client lifecycles, including disconnections and reconnections.
*   **Shared Codebase**: A dedicated `shared/` directory for constants and validation logic ensures consistency and reduces code duplication between the client and server.

## Project Structure

The project is organized into three main directories:

*   `/client`: Contains the React front-end application.
*   `/server`: Contains the Node.js, Express, and Socket.IO back-end.
*   `/shared`: Contains code shared between the client and server, such as event names and game constants.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ````bash
    git clone https://github.com/scrunch69/PokeMatch
    ````

2.  **Install Server Dependencies:**
    ````bash
    cd server
    npm install
    ````

3.  **Install Client Dependencies:**
    ````bash
    cd ../client
    npm install
    ````

4.  **Configure Environment Variables:**
    The client expects the server to be running on `http://localhost:3001`. This is configured in `client/src/contexts/SocketContext.jsx`. If you need to change this, you can modify the file directly.

### Running the Application

You will need to run both the client and the server in separate terminal windows.

1.  **Start the server:**
    ````bash
    # From the /server directory
    npm run dev
    ````

2.  **Start the client:**
    ````bash
    # From the /client directory
    npm run dev
    ````

Open your web browser and navigate to `http://localhost:5173` (or the port specified by Vite in your terminal) to see the application in action. Open a __different__ browser to simulate a second player.