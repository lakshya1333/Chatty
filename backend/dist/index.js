"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const adjectives = ["red", "blue", "green", "happy", "fast"];
const nouns = ["dragon", "unicorn", "robot", "phoenix", "tiger"];
function generateRoomId() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}-${randomNoun}-${Math.floor(Math.random() * 1000)}`;
}
const socketRoomMap = new Map();
const validRooms = new Set();
wss.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.type === "createRoom") {
                const newRoomId = generateRoomId();
                validRooms.add(newRoomId);
                socket.send(JSON.stringify({ type: "roomCreated", payload: { roomId: newRoomId } }));
                return;
            }
            if (parsedMessage.type === "join") {
                const roomId = parsedMessage.payload.roomId;
                if (!validRooms.has(roomId)) {
                    socket.send(JSON.stringify({ type: "error", message: "Invalid room ID." }));
                    console.error(`User attempted to join an invalid room: ${roomId}`);
                    return;
                }
                socketRoomMap.set(socket, roomId);
                console.log(`User joined room: ${roomId}`);
                socket.send(JSON.stringify({ type: "joined", payload: { roomId } }));
                return;
            }
            if (parsedMessage.type === "chat") {
                const currentRoom = socketRoomMap.get(socket);
                if (!currentRoom) {
                    console.error("Socket not associated with any room");
                    return;
                }
                for (const [userSocket, room] of socketRoomMap.entries()) {
                    if (room === currentRoom && userSocket.readyState === ws_1.WebSocket.OPEN) {
                        userSocket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMessage.payload.message
                            }
                        }));
                    }
                }
                return;
            }
            console.error("Unknown message type received:", parsedMessage.type);
        }
        catch (error) {
            console.error("Error processing message:", error);
        }
    });
    socket.on("close", () => {
        console.log("A user disconnected");
        socketRoomMap.delete(socket);
    });
    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});
