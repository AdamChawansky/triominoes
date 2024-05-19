import { GameState } from "../game/types";
import './DisplayScores.css';

export function DisplayScores(props: { gameState: GameState }) {
  return (
    <div className="player-scores">
      {props.gameState.scores.map((score, index) => (
        <div
          key={index}
          className={`player-score-item ${props.gameState.activePlayer === index ? "active" : ""}`}
          data-tiles={props.gameState.hands[index].length}
        >
          <div className="player-score-details">
            {/* <div className="player-name">{props.gameState.playerNames[index + 1]}</div> */}
            <div className="player-number">Player {index + 1}</div>
            <div className="player-score">{score} points</div>
          </div>
        </div>
      ))}
    </div>
  );
}