import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	const socketRef = useRef(null); // 🔥 IMPORTANT

	useEffect(() => {
		if (!authUser?._id) return;

		// ❌ prevent multiple connections
		if (socketRef.current) return;

		const socket = io("http://localhost:5000", {
			query: { userId: authUser._id },
			transports: ["websocket"], // 🔥 MUST
		});

		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("✅ Socket connected:", socket.id);
		});

		socket.on("disconnect", () => {
			console.log("❌ Socket disconnected");
		});

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [authUser?._id]);

	return (
		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};