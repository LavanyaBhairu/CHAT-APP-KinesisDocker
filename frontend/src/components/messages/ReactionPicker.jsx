const reactions = ["❤️", "👍", "😂", "🔥"];

const ReactionPicker = ({ onSelect }) => {
  return (
    <div className="flex gap-2 bg-gray-800 p-2 rounded-lg">
      {reactions.map((emoji) => (
        <span
          key={emoji}
          className="cursor-pointer text-xl hover:scale-125"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default ReactionPicker;