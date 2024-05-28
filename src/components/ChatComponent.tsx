import React, { useEffect, useRef, useState } from 'react';
import { FirebaseGameData, Message, MessageHistory } from '../game/types';
import './ChatComponent.css'
import { playerColors } from './DisplayScores';
import { firebaseSaveGameData } from '../online/firebaseApi';

// const initialMessageHistory: MessageHistory = {
//     messages: [],
//   };
  
const ChatComponent: React.FC<{playerName: string; playerIndex: number, gameData: FirebaseGameData}> = ({
  playerName,
  playerIndex,
  gameData,
}) => {
  const messageHistory = gameData.messageHistory;
  // const [messageHistory, setMessageHistory] = useState<MessageHistory>(initialMessageHistory);
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        playerName: playerName,
        playerIndex: playerIndex,
        content: inputMessage.trim(),
      };
      const updatedMessageHistory: MessageHistory = {
        messages: [...messageHistory.messages, newMessage],
      };
      firebaseSaveGameData({
        ...gameData,
        messageHistory: updatedMessageHistory,
      });
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
            <span className={`player ${playerColors[message.playerIndex]}`}>
              {message.playerName + `: `}
            </span>
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
        {/* <button onClick={handleSendMessage}>Send</button> */}
      </div>
    </div>
  );
};
  
  export default ChatComponent;