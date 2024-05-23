import { GameState } from "../game/types";
import './DisplayScores.css';

export const playerColors = [
  'player-color-red',
  'player-color-blue',
  'player-color-green',
  'player-color-purple',
  'player-color-brown',
  'player-color-orange',
];

export function DisplayScores(props: { gameState: GameState }) {
  console.log(props.gameState);
  return (
    <div className="player-scores">
      {props.gameState.scores.map((score, index) => (
        <div
          key={index}
          className={`player-score-item ${props.gameState.activePlayer === index ? "active" : ""}`}
          data-tiles={props.gameState.hands[index].length}
        >
          <div className="player-score-details">
            <div className="player-active-box">
              {props.gameState.activePlayer === index && (
                <img src='./active-player.gif' 
                alt="Active Player"
                className="active-player-gif" />
              )}
            </div>
            <div className={`player-name ${playerColors[index]}`}>
              {props.gameState.playerNames[index]}
            </div>
            <div className="player-score">{score} points</div>
          </div>
        </div>
      ))}
    </div>
  );
}