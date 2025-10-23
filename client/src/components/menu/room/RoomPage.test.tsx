import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockSocketContext } from "../../../__tests__/mocks/mockContexts";
import { createMockViewRoom } from "../../../__tests__/mocks/mockViewRoom";
import { StatNames } from "../../../../../shared/constants/constants";
import { Pages, StatToDisplay } from "../../../constants/constants";
import { Pokemon, ViewGame, ViewRoom } from "../../../../../shared/types/types";
import { UI_TEXT } from "../../../constants/uiText";

let mockSocketContext = createMockSocketContext();
const mockNavigate = vi.fn();
vi.mock("../../../contexts/SocketContext", () => ({
    useSocketContext: () => mockSocketContext,
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

        expect(screen.getByText(UI_TEXT.LABELS.ROOM_ID(viewRoom!.id))).toBeInTheDocument();
        expect(screen.getByText(viewRoom.viewClientRecords[0].clientName)).toBeInTheDocument();
        expect(screen.getByText(viewRoom.viewClientRecords[1].clientName)).toBeInTheDocument();

        expect(screen.getByText(UI_TEXT.BUTTONS.NOT_READY)).toBeInTheDocument();
        expect(screen.getByText(UI_TEXT.STATUS.ARE_YOU_READY)).toBeInTheDocument();
    });

    test("updates ready status on server state update, updates ready button on user click", async () => {
        const user = userEvent.setup();
        viewRoom.viewClientRecords[0].isReady = false;
        viewRoom.viewClientRecords[1].isReady = false;
        const { rerender } = render(<RoomPage />);

        expect(screen.getByText(UI_TEXT.BUTTONS.NOT_READY)).toBeInTheDocument();
        expect(screen.getAllByText(UI_TEXT.STATUS.CLIENT_NOT_READY)).toHaveLength(2);
        expect(screen.queryByText(new RegExp(UI_TEXT.STATUS.WAITING_FOR_OPPONENT))).toBeNull();

        viewRoom.viewClientRecords[0].isReady = true;
        rerender(<RoomPage />);

        expect(screen.getAllByText(UI_TEXT.STATUS.CLIENT_NOT_READY)).toHaveLength(1);

        const readyButton = screen.getByRole("button", { name: new RegExp(UI_TEXT.BUTTONS.NOT_READY) });

        await user.click(readyButton);
        expect(mockSocketContext.toggleReady).toHaveBeenCalled();
        expect(screen.getByText(UI_TEXT.BUTTONS.READY)).toBeInTheDocument();
        expect(screen.queryByText(new RegExp(UI_TEXT.STATUS.WAITING_FOR_OPPONENT))).toBeDefined();
    });

    test("hides 'ADD BOT' button when more than 1 player in room", () => {
        viewRoom.viewClientRecords.pop(); // Now 1 player
        const { rerender } = render(<RoomPage />);
        const addBotButton = screen.getByRole("button", { name: new RegExp(UI_TEXT.BUTTONS.ADD_BOT) });
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
        expect(screen.getByText(UI_TEXT.MESSAGES.LOADING_ROOM)).toBeInTheDocument();
    });
});
