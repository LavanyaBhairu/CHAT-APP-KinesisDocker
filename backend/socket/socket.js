import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// Typing event
	socket.on("typing", ({ senderId, receiverId }) => {
		console.log("Typing event from:", senderId, "to:", receiverId);

		const receiverSocketId = userSocketMap[receiverId];

		console.log("Socket map:", userSocketMap);
		console.log("Receiver socket:", receiverSocketId);

		if (receiverSocketId) {
			console.log("Sending typing to:", receiverId);

			io.to(receiverSocketId).emit("typing", { senderId });
		} else {
			console.log("❌ Receiver not connected");
		}
	});

	// Stop typing event
	socket.on("stopTyping", ({ senderId, receiverId }) => {
		const receiverSocketId = userSocketMap[receiverId];

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("stopTyping", { senderId });
		}
	});

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };