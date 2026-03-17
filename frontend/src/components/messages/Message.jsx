const Message = ({ message }) => {
	
	return (
		<div className={`chat chat-end`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={
                        "https://www.google.com/imgres?q=avatar%20image%20url%20im%20.png%20format%20for%20react%20js&imgurl=https%3A%2F%2Fwww.w3schools.com%2Fhowto%2Fimg_avatar2.png&imgrefurl=https%3A%2F%2Fwww.w3schools.com%2Fhowto%2Fhowto_css_image_avatar.asp&docid=IN--qpeX1hje-M&tbnid=AhCy_cweM6lOWM&vet=12ahUKEwjp2bzPt6eTAxVV2DQHHb9YIo4QnPAOegQIIhAB..i&w=499&h=498&hcb=2&ved=2ahUKEwjp2bzPt6eTAxVV2DQHHb9YIo4QnPAOegQIIhAB"

                    } />
				</div>
			</div>
			<div className={`chat-bubble text-white bg-blue-500`}>Hi what is up?</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>12:42</div>
		</div>
	);
};
export default Message;