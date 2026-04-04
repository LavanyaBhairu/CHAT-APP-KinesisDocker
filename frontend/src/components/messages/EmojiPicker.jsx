import EmojiPicker from "emoji-picker-react";

const EmojiPickerComponent = ({ onEmojiClick }) => {
  return (
    <div className="absolute bottom-16 z-50">
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPickerComponent;