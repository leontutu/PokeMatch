export const UI_TEXT = {
    BUTTONS: {
        ADD_BOT: "ADD BOT",
        NOT_READY: "READY?",
        READY: "READY!",
        BACK_TO_HOME: "Back to Home",
        MATCH: "Match",
        HOW_TO_PLAY: "How To Play",
        CREATE_ROOM: "Create Room",
        JOIN_ROOM: "Join Room",
        PLAY_VS_BOT: "Play vs Bot",
        SUBMIT: "Submit",
        CHOOSE: "CHOOSE!",
        LOCKED_IN: "LOCKED IN!",
        RETURN_TO_MENU: "Return to Menu",
        YES: "Yes",
        NO: "No",
    },

    STATUS: {
        CLIENT_READY: "Ready",
        CLIENT_NOT_READY: "Not Ready",
        GAME_STARTING: "Starting Game",
        WAITING_FOR_OPPONENT: "Waiting for opponent",
        ARE_YOU_READY: "Are you ready?",
    },

    LABELS: {
        ROOM_ID: (id: number) => `Room ID: ${id}`,
        ENTER_YOUR_NAME: "Enter Your Name",
        ENTER_ROOM_ID: "Enter Room ID",
        ROUND: (roundNumber: number) => `Round ${roundNumber}`,
        VS: "vs",
    },

    VALIDATION: {
        LOOKS_GOOD: "Looks good!",
        NAME_REQUIREMENTS: "3-9 chars | A-Z & 0-9",
        ROOM_ID_REQUIREMENTS: "Must be a number greater than 0",
    },

    PLACEHOLDERS: {
        YOUR_NAME_HERE: "Your name here",
        ROOM_ID_HERE: "Room ID here",
    },

    ALERTS: {
        INVALID_NAME: "Invalid name. Make sure your name is between 4 and 9 characters long",
        ROOM_NOT_FOUND: (roomId: string) => `Room with ID ${roomId} is either full or doesn't exist.`,
        STAT_ALREADY_LOCKED: "[Server]: You selected an already locked stat.",
    },

    MESSAGES: {
        READY_TO_BATTLE: "...is ready to battle!",
        WINNER_ANNOUNCEMENT: (name: string) => `${name} won!`,
        LOADING: "Loading...",
        LOADING_ROOM: "Loading room...",
        LEAVE_CONFIRMATION: "Leave room and return to main menu?",
    },

    ALT_TEXT: {
        YOUR_POKEMON: "Your Pokemon",
        OPPONENT_POKEMON: "Opponent's Pokémon",
        POKEBALL: "pokeball",
        LOGO: "PokeMatch logo",
        CHAT_BUBBLE: "Chat Bubble",
        INSTRUCTION_IMAGE: "Instruction Image",
        ROUND_IMAGE: (roundNumber: number) => `Round ${roundNumber}`,
    },
} as const;
