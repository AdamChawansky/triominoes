import { GameState, NewTile } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './DisplayHand.css';

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
  soundEffectsEnabled: boolean,
}) {
  const { playerIndex, gameState, tileInHand, setTileInHand, soundEffectsEnabled } = props;

  // ADMIN: displays hand of activePlayer, otherwise display hand of local player
  const playerHand = gameState.hands[playerIndex];

  if( gameState.gameBoard.size === 0 ) {
    return (<div></div>);
  } else {
    return (
      <div className="player-hand">
        {playerHand.map((newTile) => (
          <TileInHand
            key={newTile.id}
            newTile={newTile}
            isSelected={newTile.id === tileInHand?.id}
            setTileInHand={setTileInHand}
            soundEffectsEnabled={soundEffectsEnabled}
          />
        ))}
      </div>
    );
  }
}