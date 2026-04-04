import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import ReactionPicker from "./ReactionPicker";
import axios from "axios";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);

	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe
		? authUser.profilePic
		: selectedConversation?.profilePic;

	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const shakeClass = message.shouldShake ? "shake" : "";

	//  NEW STATE
	const [showReactions, setShowReactions] = useState(false);

	//  HANDLE REACTION
	const handleReaction = async (emoji) => {
		try {
			await axios.post("/api/messages/react", {
				messageId: message._id,
				emoji,
			});
			setShowReactions(false);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className={`chat ${chatClassName}`}>
			{/* Avatar */}
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						alt='profile'
						src={
							profilePic ||
							`https://ui-avatars.com/api/?name=${
								fromMe
									? authUser.fullName
									: selectedConversation?.fullName
							}`
						}
					/>
				</div>
			</div>

			{/*  MESSAGE WRAPPER (IMPORTANT) */}
			<div
				className="relative"
				onClick={() => setShowReactions(!showReactions)}
			>
				{/* Message Bubble */}
				<div
					className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 cursor-pointer`}
				>
					{message.message}
				</div>

				{/*  REACTION PICKER */}
				{showReactions && (
					<div className="absolute -top-12 left-0 z-50">
						<ReactionPicker onSelect={handleReaction} />
					</div>
				)}

				{/*  SHOW REACTIONS */}
				{message.reactions && message.reactions.length > 0 && (
					<div className="flex gap-1 mt-1">
						{message.reactions.map((r, i) => (
							<span key={i} className="text-sm">
								{r.emoji}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Time */}
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
				{formattedTime}
			</div>
		</div>
	);
};

export default Message;