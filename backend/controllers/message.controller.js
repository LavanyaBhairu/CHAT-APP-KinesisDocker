import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { sendMessageToKinesis } from "../utils/kinesisProducer.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		//  Save in DB
		await Promise.all([conversation.save(), newMessage.save()]);

		//  SEND TO KINESIS (instead of socket)
		await sendMessageToKinesis({
			...newMessage.toObject(),
			type: "NEW_MESSAGE",
		});

		res.status(201).json(newMessage);

	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);

		res.status(200).json(conversation.messages);

	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addReaction = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // remove old reaction from same user
    message.reactions = message.reactions.filter(
      (r) => r.userId !== userId.toString()
    );

    message.reactions.push({
      userId: userId.toString(),
      emoji,
    });

    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    console.error("🔥 Reaction error:", error);
    return res.status(500).json({ error: error.message });
  }
};