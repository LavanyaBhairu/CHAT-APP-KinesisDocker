import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPickerComponent from "./EmojiPicker";
import { BsEmojiSmile } from "react-icons/bs";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const { loading, sendMessage } = useSendMessage();

	const pickerRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		await sendMessage(message);
		setMessage("");
	};

	//  Add emoji to input
	const handleEmojiClick = (emojiData) => {
		setMessage((prev) => prev + emojiData.emoji);
		setShowPicker(false); // close after select
	};

	//  Close picker on outside click
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

				{/*  Emoji Button */}
				<button
					type='button'
					onClick={() => setShowPicker(!showPicker)}
					className='text-gray-300 hover:text-yellow-400 text-xl transition'
				>
					<BsEmojiSmile />
				</button>

				{/*  Emoji Picker */}
				{showPicker && (
					<div ref={pickerRef} className='absolute bottom-12 z-50'>
						<EmojiPickerComponent onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{/*  Input */}
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				{/*  Send Button */}
				<button
					type='submit'
					className='flex items-center justify-center'
				>
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

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full relative'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;