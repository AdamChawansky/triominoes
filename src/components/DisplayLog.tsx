import { useState } from "react";
import { GameState } from "../game/types";

export function DisplayGameLog(props: {
  gameState: GameState,
}) {
  const [isCollapsed, setIsCollapsed] =useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`game-log ${isCollapsed ? "collapsed" : ""}`}>
      <h3 className="game-log-header" onClick={toggleCollapse}>
        Game Log {isCollapsed ? "+" : "-"}
      </h3>
      {!isCollapsed && (
        <ul className="game-log-entries">
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