import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockSocketContext } from "../../../__tests__/mocks/mockContexts";
import { createMockViewRoom } from "../../../__tests__/mocks/mockViewRoom";
import { StatNames } from "../../../../../shared/constants/constants";
import { Pages, StatToDisplay } from "../../../constants/constants";
import { Pokemon, ViewGame, ViewRoom } from "../../../../../shared/types/types";

let mockSocketContext = createMockSocketContext();
const mockNavigate = vi.fn();
vi.mock("../../../contexts/SocketContext", () => ({
    useSocket: () => mockSocketContext,
}));

vi.mock("../../../contexts/NavigationContext", () => ({
    useNavigationContext: () => ({
        handleNavigate: mockNavigate,
        currentPage: Pages.SELECT_STAT,
    }),
}));

import RoomPage from "./RoomPage";

describe("RoomPage", () => {
    let viewRoom: ViewRoom;
    beforeEach(() => {
        vi.restoreAllMocks();

        mockSocketContext = createMockSocketContext();
        mockSocketContext.viewRoom = createMockViewRoom();
        viewRoom = mockSocketContext.viewRoom;
        viewRoom.viewGame = null;
    });

    test("renders with all elements", () => {
        render(<RoomPage />);

        expect(screen.getByText(`Room ID: ${viewRoom!.id}`)).toBeInTheDocument();
        expect(screen.getByText(viewRoom.viewClientRecords[0].clientName)).toBeInTheDocument();
        expect(screen.getByText(viewRoom.viewClientRecords[1].clientName)).toBeInTheDocument();

        expect(screen.getByText("READY?")).toBeInTheDocument();
        expect(screen.getByText("Are you ready?")).toBeInTheDocument();
    });

    test("updates ready status on server state update, updates ready button on user click", async () => {
        const user = userEvent.setup();
        viewRoom.viewClientRecords[0].isReady = false;
        viewRoom.viewClientRecords[1].isReady = false;
        const { rerender } = render(<RoomPage />);

        expect(screen.getByText("READY?")).toBeInTheDocument();
        expect(screen.getAllByText("Not Ready")).toHaveLength(2);
        expect(screen.queryByText(/Waiting for opponent/)).toBeNull();

        viewRoom.viewClientRecords[0].isReady = true;
        rerender(<RoomPage />);

        expect(screen.getAllByText("Not Ready")).toHaveLength(1);

        const readyButton = screen.getByRole("button", { name: /READY\?/ });

        await user.click(readyButton);
        expect(mockSocketContext.toggleReady).toHaveBeenCalled();
        expect(screen.getByText("READY!")).toBeInTheDocument();
        expect(screen.queryByText(/Waiting for opponent/)).toBeDefined();
    });

    test("hides 'ADD BOT' button when more than 1 player in room", () => {
        viewRoom.viewClientRecords.pop(); // Now 1 player
        const { rerender } = render(<RoomPage />);
        const addBotButton = screen.getByRole("button", { name: /ADD BOT/ });
        expect(addBotButton).toBeInTheDocument();
        expect(addBotButton).not.toHaveClass(/hidden/);
        viewRoom.viewClientRecords.push(createMockViewRoom().viewClientRecords[1]);
        rerender(<RoomPage />);
        expect(addBotButton).toHaveClass(/hidden/);
    });

    test("returns 'Loading Room...' if viewRoom is null", () => {
        mockSocketContext.viewRoom = null;
        render(<RoomPage />);
        expect(true).toBe(true);
        expect(screen.getByText("Loading room...")).toBeInTheDocument();
    });
});
