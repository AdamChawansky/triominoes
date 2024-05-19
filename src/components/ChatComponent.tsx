import React, { useEffect, useRef, useState } from 'react';
import { Message, MessageHistory } from '../game/types';
import './ChatComponent.css'

const initialMessageHistory: MessageHistory = {
    messages: [],
  };
  
const ChatComponent: React.FC<{playerName: string}> = ({playerName}) => {
  const [messageHistory, setMessageHistory] = useState<MessageHistory>(initialMessageHistory);
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        player: playerName,
        content: inputMessage.trim(),
      };
      setMessageHistory((prevHistory) => ({
        messages: [...prevHistory.messages, newMessage],
      }));
      setInputMessage('');
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-component">
      <div className="message-container" ref={messageContainerRef}>
        {messageHistory.messages.map((message, index) => (
          <div key={index} className="message">
            <span className="player">{message.player}: </span>
            <span className="content">{message.content}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
  
  export default ChatComponent;