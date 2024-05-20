import { GameState } from "../game/types";
import './DisplayScores.css';

const playerColors = [
  'player-color-red',
  'player-color-blue',
  'player-color-green',
  'player-color-purple',
  'player-color-brown',
  'player-color-orange',
];

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
            <div className="player-name-container">
              {props.gameState.activePlayer === index && (
                <img src='../../public/assets/active_player.gif' alt="Active Player" className="active-player-gif" />
              )}
              <div className={`player-name ${playerColors[index]}`}>
                {props.gameState.playerNames[index + 1]}
              </div>
            </div>
            <div className={`player-number ${playerColors[index]}`}>
              {props.gameState.playerNames[index + 1]}
              Player {index + 1}
            </div>
            <div className="player-score">{score} points</div>
          </div>
        </div>
      ))}
    </div>
  );
}