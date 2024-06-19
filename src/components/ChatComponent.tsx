import React, { useEffect, useRef, useState } from 'react';
import { FirebaseGameData, Message, MessageHistory } from '../game/types';
import './ChatComponent.css'
import { playerColors } from './DisplayScores';
import { firebaseSaveGameData } from '../online/firebaseApi';

const ChatComponent: React.FC<{playerName: string; playerIndex: number, gameData: FirebaseGameData}> = ({
  playerName,
  playerIndex,
  gameData,
}) => {
  const messageHistory = gameData.messageHistory;
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    scrollToBottom();
    if (!expanded) {
      setHasNewMessage(true);
    }
  }, [messageHistory, expanded]);

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
      setHasNewMessage(false);
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

  const toggleExpanded = () => {
    // setExpanded(!expanded); THIS CODE IS FOR WHEN I FIGURE OUT EXPANDING
    if (hasNewMessage) {
      setExpanded(expanded);
    }
    setHasNewMessage(false);
  }

  return (
    <div className={`chat-component ${expanded ? 'expanded' : 'minimized'}`} onClick={toggleExpanded}>
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

/* 
<------------- Chat Component in Progress ----------------->

  <div className={`chat-component ${expanded ? 'expanded' : 'minimized'}`}>
      <div className="chat-header" onClick={toggleExpanded}>
        <h3>Chat</h3>
        {hasNewMessage && <div className="notification"></div>}
      </div>
      {expanded && (
        <>
          <div className="message-container" ref={messageContainerRef}>
            {messageHistory.messages.map((message, index) => (
              <div key={index} className="message">
                <span className={`player ${playerColors[message.playerIndex]}`}>
                  {message.playerName + ': '}
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
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );


*/