import { GameState, NewTile } from '../game/types.ts';
import { TileInHand } from './TileInHand.tsx';
import './DisplayHand.css';
import './DisplayGameBoard.css'

export function DisplayHand(props: {
  playerIndex: number,
  gameState: GameState,
  tileInHand: NewTile | undefined,
  setTileInHand: (b: NewTile | undefined) => void,
}) {
  const { playerIndex, gameState, tileInHand, setTileInHand } = props;

  // Only display hand of local player
  const playerHand = gameState.hands[playerIndex];
  // ADMIN: display hand of activePlayer
  // const playerHand = gameState.hands[gameState.activePlayer];

  // function onClick(tile: NewTile) {
  //   if(tileInHand?.id === tile.id) {
  //     setTileInHand(undefined);
  //   } else {
  //     setTileInHand(tile);
  //   }
  // }

  if( gameState.gameBoard.size === 0 ) {
    return (<div></div>);
  } else {
    return (
      <div className="player-hand">
        {playerHand.map((newTile) => (
          <TileInHand
            key={newTile.id}
            newTile={newTile}
            gameState={gameState}
            isSelected={newTile.id === tileInHand?.id}
            // onClick={() => onClick(newTile)}
            setTileInHand={setTileInHand}
          />
        ))}
      </div>
    );
  }
}