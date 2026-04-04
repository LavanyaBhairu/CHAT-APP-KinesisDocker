import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) =>
		set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set({ messages }),

	updateMessageReaction: (messageId, reactions) =>
		set((state) => ({
			messages: state.messages.map((msg) =>
				msg._id === messageId ? { ...msg, reactions } : msg
			),
		})),
}));

export default useConversation;