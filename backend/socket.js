export default function registerSocketHandlers(io) {
    console.log("Socket Handlers called");

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId || socket.handshake.query.userId;

        console.log("Socket connected", socket.id);

        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joins a personal room`);
        }

        socket.on("join", (roomId) => {
            socket.join(roomId);
            console.log(`User ${roomId} joined a chat`);
        });
    });
}