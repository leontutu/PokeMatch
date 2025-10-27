<h1 align="center">⚪ PokeMatch 🔴</h1>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white" alt="Socket.io"/>
  <img src="https://img.shields.io/badge/tests-100%2B_passing-brightgreen" alt="Tests"/>
</p>

<p align="center">
  <a href="#️-architecture">🏗️ Architecture</a> •
  <a href="#-tech-stack">💻 Tech Stack</a> •
  <a href="#️-running-locally">⚙️ Setup</a>
</p>

<p align="center">
  <b>A real-time multiplayer game where players challenge each other using Pokémon in a "Top Trumps" showdown.</b>
  <br/>
  <sub>Full-stack TypeScript • Stateful sessions • 100+ unit tests • CI/CD pipeline</sub>
</p>
<p align="center">
  <a href="https://pokematch-guii.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/🎮-PLAY_NOW-FF4757?style=for-the-badge&labelColor=FF6B6B&logoColor=white" 
         alt="Play Now"
         style="height: 70px; border-radius: 12px; box-shadow: 0 4px 14px 0 rgba(255, 71, 87, 0.4); transition: transform 0.2s;">
  </a>
  <br/>
  <sub><i>⚠️ First load may take 30-60s as free-tier server wakes up</i></sub>
</p>

<p align="center">
  <img src="./docs/screenshots/screenshot-1.png" height="300" hspace="30">
  <img src="./docs/screenshots/screenshot-2.png" height="300" hspace="30">
  <img src="./docs/screenshots/screenshot-3.png" height="300" hspace="30">
</p>

<p align="center">
This is a portfolio project designed to showcase my abilites as a full stack developer.
</p>

---

## ⚡ Tech Highlights: 
* **Full-stack TypeScript, WebSocket architecture, stateful sessions, 100+ unit tests with CI/CD pipeline.**
* **Stateful Session Management**: UUID-based client identification enables automatic reconnection with full state restoration, supporting mid-game disconnections without data loss.
* **Headless Bot API**: RESTful endpoint spawns autonomous opponents, connecting to the server socket interface as regular clients.
* **Monorepo Architecture**: npm workspaces manage shared TypeScript type aliases, constants, and validation logic across client/server, eliminating API contract bugs.

---

## 🏗️ Architecture

### Server Archtitecture
<!-- ![Server Architecture diagram](./diagrams/server-architecture-diagram.svg) -->
<details>
  <summary>Architecture Diagram (simplified)</summary>
  <img src="./docs/diagrams/server-architecture-diagram.png" alt="Server Architecture diagram" width="100%">
</details>

**Design Patterns:**
- **Mediator Pattern**: Central `Orchestrator` class coordinates between services
- **Observer Pattern**: Event-driven state propagation via Node.js EventEmitter
- **Command Pattern**: Game actions encapsulated as command objects processed by the core `Game` model

**SOLID Principles:**
- **Single Responsibility**: Each class has one clearly defined purpose
- **Dependency Injection**: Pure DI of services via constructor injection
- **Interface Segregation**: Clients depend only on methods they use

**Key Features:**
- Stateful room and session lifecycle management
- RESTful bot API for headless opponents
- Graceful handling of disconnects/reconnects
- Robust defensive programming checks and guards 

**Testing:** 58+ unit and integration tests covering game logic, managers, and full workflows

---

### Client Architecture 

**Core Patterns:**
- **Custom Hooks for Business Logic**: Separation of concerns via hooks like `useBattleLogic` and `useBattleSequence`, keeping components purely presentational
- **Context-Based State Management**: Centralized WebSocket state via custom `useSocketContext` hook, eliminating prop drilling
- **SCSS Modules**: Scoped styling prevents collisions in a component-heavy UI

**Key Features:**
- Persistent sessions via localStorage UUID
- Real-time state synchronization across all clients via WebSocket events
- Optimistic UI updates with server-side validation and conflict resolution
- Component-driven architecture with custom hooks for clean separation of concerns

**Testing:** 27+ component and hook tests using Vitest + React Testing Library


---
<details>
<summary><h3>Example Gameflow Sequence Diagram</h3></summary>
  <img src="./docs/diagrams/sequence-diagram.png" alt="Sequence diagram" width="100%">
  #### Notes

  - **Error Handling**: The above diagram shows the Happy Path only. At multiple points (client validation, room validation, game logic), errors can occur. The system follows a consistent pattern: log the error, emit an error event to the client, and halt processing. The client displays the error to the user.

  - **State Synchronization**: After any state change, all clients in the room receive personalized updated `ViewRoom` data via the `UPDATE` event, ensuring UI consistency.
</details>




---

## 📒 Development Journey

This project was built over 2 months with 250+ commits and 30+ feature branches, showcasing:

- Feature branch workflow with descriptive commit messages
- Planning and tracking of tasks through detailed Issues
- Continuous refactoring based on learnings
- JavaScript to TypeScript, CSS to SCSS migrations

What started as a sandbox weekend project evolved into a production-ready multiplayer game with comprehensive testing, CI/CD, and scalable architecture.

[Link to commit history](https://github.com/leontutu/pokematch/commits)

---

## 💻 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

#### Frontend
- ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) Component-based UI library
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) Type-safe JavaScript
- ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) Fast build tool and dev server
- ![SCSS](https://img.shields.io/badge/-SCSS-CC6699?style=flat&logo=sass&logoColor=white) CSS preprocessor

#### Backend
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) JavaScript runtime
- ![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white) Web server framework
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) Type-safe JavaScript

#### Communication
- ![Socket.IO](https://img.shields.io/badge/-Socket.IO-010101?style=flat&logo=socket.io&logoColor=white) Real-time bidirectional events
- ![REST API](https://img.shields.io/badge/-REST_API-009688?style=flat&logo=fastapi&logoColor=white) Stateless request-response

</td>
<td width="50%" valign="top">


#### Testing
- ![Vitest](https://img.shields.io/badge/-Vitest-6E9F18?style=flat&logo=vitest&logoColor=white) Fast unit test runner
- ![React Testing Library](https://img.shields.io/badge/-RTL-E33332?style=flat&logo=testing-library&logoColor=white) Component testing utilities

#### DevOps & Tooling
- ![Git](https://img.shields.io/badge/-Git-F05032?style=flat&logo=git&logoColor=white) Version control
- ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white) CI/CD pipeline
- ![npm](https://img.shields.io/badge/-npm_workspaces-CB3837?style=flat&logo=npm&logoColor=white) Monorepo management
- ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) Code quality
- ![Render](https://img.shields.io/badge/-Render-46E3B7?style=flat&logo=render&logoColor=white) Cloud hosting

</td>
</tr>
</table>

### ⚙️ Running locally

**Prerequisites:**
- Node.js v20+ (or v18+)
- npm (comes with Node.js)

**Quick Start:**
```bash
# Clone and install
git clone https://github.com/leontutu/PokeMatch
cd PokeMatch
npm install

# Run tests (optional)
npm run test

# Start server (terminal 1)
npm run dev:server

# Start client (terminal 2)  
npm run dev:client

# In your browser
Open: http://localhost:5173
Simulate 2nd player: Use a different browser or private window
```
