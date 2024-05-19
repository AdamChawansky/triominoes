import { GameState } from "../game/types";

export function DisplayScores(props: {
  gameState: GameState,
}) {
  return (
    <div className="player-scores">
      <div className="player-scores-header">
        <div>Player</div>
        <div>Score</div>
      </div>
      {props.gameState.scores.map((score, index) => (
        <div
          key={index}
          className={`player-score-item ${props.gameState.activePlayer === index ? "active" : ""}`}
          data-tiles={props.gameState.hands[index].length}
        >
          <div className="player-score-details">
            <div>{props.gameState.playerNames[index + 1]}</div>
            <div>{score}</div>
          </div>
        </div>
      ))}
    </div>
  );
}