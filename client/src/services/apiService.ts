export function addBotToRoom(roomId: number) {
    return fetch(`/api/bot/${roomId}`, {
        method: "POST",
    });
}
