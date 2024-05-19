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
    scrollToTop();
  }, [props.gameState]);

  const scrollToTop = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className={`game-log ${isCollapsed ? "collapsed" : ""}`}>
      <h3 className="game-log-header" onClick={toggleCollapse}>
        Game Log {isCollapsed ? "+" : "-"}
      </h3>
      {!isCollapsed && (
        <ul className="game-log-entries" ref={messageContainerRef}>
          {[...props.gameState.gameLog].reverse().map((entry, index) => (
            <li key={index} className="game-log-entry">
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}