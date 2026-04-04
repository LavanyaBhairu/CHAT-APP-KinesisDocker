import { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { socket } = useSocketContext();
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	useEffect(() => {
	if (!socket || !selectedConversation) return;

	const handleTyping = ({ senderId }) => {
		console.log("Typing event received:", senderId);
		console.log("Selected:", selectedConversation?._id);

		if (String(senderId) === String(selectedConversation?._id)) {
			console.log("MATCHED → show typing");
			setIsTyping(true);
		}
	};

	const handleStopTyping = ({ senderId }) => {
		console.log("Stop typing event:", senderId);

		if (String(senderId) === String(selectedConversation?._id)) {
			setIsTyping(false);
		}
	};

	// ✅ Attach listeners
	socket.on("typing", handleTyping);
	socket.on("stopTyping", handleStopTyping);

	// ✅ Cleanup ONLY this listener (IMPORTANT)
	return () => {
		socket.off("typing", handleTyping);
		socket.off("stopTyping", handleStopTyping);
	};
}, [socket, selectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2 flex flex-col'>
						<span className='text-gray-900 font-bold'>
							{selectedConversation.fullName}
						</span>

						{isTyping && (
							<span className='text-xs text-gray-200 animate-pulse'>
								Typing...
							</span>
						)}
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome  {authUser.fullName} </p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";
// import { TiMessages } from "react-icons/ti";


// const MessageContainer = () => {
//     const noChatSelected = true
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
//             {noChatSelected ? (
//                  <NoChatSelected />
//             ) :(
//                 <>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
//             )}
			
// 		</div>
// 	);
// };
// export default MessageContainer;

// const NoChatSelected = () => {
// 	//const { authUser } = useAuthContext();
// 	return (
// 		<div className='flex items-center justify-center w-full h-full'>
// 			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
// 				{/* <p>Welcome  {authUser.fullName} </p> */}
// 				<p>Select a chat to start messaging</p>
// 				<TiMessages className='text-3xl md:text-6xl text-center' />
// 			</div>
// 		</div>
// 	);
// };