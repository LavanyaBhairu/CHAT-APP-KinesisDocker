import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	const [typingUser, setTypingUser] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	useEffect(() => {
		if (!socket || !selectedConversation) return;

		socket.on("typing", ({ senderId }) => {
			if (senderId === selectedConversation._id) {
				setTypingUser(true);
			}
		});

		socket.on("stopTyping", ({ senderId }) => {
			if (senderId === selectedConversation._id) {
				setTypingUser(false);
			}
		});

		return () => {
			socket.off("typing");
			socket.off("stopTyping");
		};
	}, [socket, selectedConversation]);

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}
			{typingUser && (
				<p className="text-sm text-gray-400 px-4 mt-1">
					<p>{selectedConversation.fullName} is Typing... </p>
				</p>
			)}
		</div>
	);
};
export default Messages;


// STARTER CODE SNIPPET
// import Message from "./Message";
// import useGetMessages from "../../hooks/useGetMessages";

// const Messages = () => {
// 	const { messages, loading } = useGetMessages();
// console.log("messages:", messages);

// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;