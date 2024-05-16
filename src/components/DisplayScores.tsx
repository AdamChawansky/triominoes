import { GameState } from "../game/types";

export function DisplayScores(props: {
  gameState: GameState,
}) {
  return (
    <div className="player-scores">
      <div>
        <div>Player</div>
        <div>Score</div>
        <div>Tiles in Hand</div>
      </div>
      {props.gameState.scores.map((score, index) => (
        <div key={index} className={props.gameState.activePlayer === index ? "active" : ""}>
          <div>{index+1}</div>
          <div>{score}</div>
          <div>{props.gameState.hands[index].length}</div>
        </div>
      ))}
    </div>
  );
}