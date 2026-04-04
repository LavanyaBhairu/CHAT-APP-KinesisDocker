import { useState, useRef, useEffect } from "react";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPickerComponent from "./EmojiPicker";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation"; 

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const { loading, sendMessage } = useSendMessage();

	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const { authUser } = useAuthContext();

	const typingTimeoutRef = useRef(null);
	const pickerRef = useRef();

	// HANDLE TYPING
	const handleTyping = (e) => {
		const value = e.target.value;
		setMessage(value);

		if (!selectedConversation) return;

		// 🔥 Emit typing
		socket.emit("typing", {
			senderId: authUser._id,
			receiverId: selectedConversation._id,
		});

		// 🔥 Clear previous timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// 🔥 Stop typing after delay
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("stopTyping", {
				senderId: authUser._id,
				receiverId: selectedConversation._id,
			});
		}, 1000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		await sendMessage(message);

		// ✅ STOP TYPING ON SEND
		socket.emit("stopTyping", {
			senderId: authUser._id,
			receiverId: selectedConversation._id,
		});

		setMessage("");
	};

	// Emoji select
	const handleEmojiClick = (emojiData) => {
		setMessage((prev) => prev + emojiData.emoji);
		setShowPicker(false);
	};

	// Close picker on outside click
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (pickerRef.current && !pickerRef.current.contains(e.target)) {
				setShowPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<form className='px-4 my-3 relative' onSubmit={handleSubmit}>
			<div className='w-full flex items-center gap-2 relative'>

				<button
					type='button'
					onClick={() => setShowPicker(!showPicker)}
					className='text-gray-300 hover:text-yellow-400 text-xl transition'
				>
					<BsEmojiSmile />
				</button>

				{showPicker && (
					<div ref={pickerRef} className='absolute bottom-12 z-50'>
						<EmojiPickerComponent onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{/* ✅ FIXED INPUT */}
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={handleTyping}
				/>

				<button type='submit' className='flex items-center justify-center'>
					{loading ? (
						<div className='loading loading-spinner'></div>
					) : (
						<BsSend />
					)}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;