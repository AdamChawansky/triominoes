import { GameState } from "../game/types";

export function DisplayGameLog(props: {
  gameState: GameState,
}) {
  return (
    <div className="game-log">
      <h3 style={{ marginTop: '0' }}>Game Log</h3>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {props.gameState.gameLog.map((entry, index) => (
          <li
            key={index}
            style={{
              marginBottom: '4px',
              paddingBottom: '4px',
              paddingLeft: '5px',
              borderBottom: '1px solid grey',
              textAlign: 'left',
            }}
          >
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}