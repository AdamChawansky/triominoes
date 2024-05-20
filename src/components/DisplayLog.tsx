import { useEffect, useRef, useState } from "react";
import { GameState } from "../game/types";
import './DisplayLog.css';

export function DisplayGameLog(props: { gameState: GameState }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messageContainerRef = useRef<HTMLUListElement>(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.gameState]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className={`game-log ${isCollapsed ? "collapsed" : ""}`}>
      <h3 className="game-log-header" onClick={toggleCollapse}>
        Game Log {isCollapsed ? "+" : "-"}
      </h3>
      {!isCollapsed && (
        <ul className="game-log-entries" ref={messageContainerRef}>
          {props.gameState.gameLog.map((entry, index) => (
            <li key={index} className="game-log-entry">
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}