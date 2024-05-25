import { useEffect, useState } from 'react';
import { initializeNewGameHistory, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { MAX_DRAW } from '../game/logic.ts';
import { Action, FirebaseGameData, GameHistory, GameState, NewTile } from '../game/types.ts';
import { CopyToClipboard } from '../online/CopyToClipboard.tsx';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import ChatComponent from './ChatComponent.tsx';
import { GameBoardView } from './DisplayGameBoard.tsx';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './RootDisplay.css';

export function RootDisplay(props: {
  initialGameData: FirebaseGameData,
  localPlayerID: string,
}) {
  // local state
  const [gameData, setGameData] = useState<FirebaseGameData>(props.initialGameData);
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();
  const [gameInProgress, setGameInProgress] = useState(false);
  
  // on first render
  useEffect(() => {
    async function startSubscription() {
      await firebaseSubscribeGameData(
        props.initialGameData,
        gameData => setGameData(gameData),
      );
    }
    startSubscription();
  }, []);

  const playerIndex = gameData.players.findIndex((player) => player.playerID === props.localPlayerID);
  const playerName = playerIndex !== -1 ? gameData.players[playerIndex].playerName : '';

  // helpers
  const gameHistory = gameData.gameHistory;
  function setGameHistory(newGameHistory: GameHistory) {
    firebaseSaveGameData({
      ...gameData,
      gameHistory: newGameHistory,
    });
  }
  const gameState = replayHistory(gameHistory);

  function startNewGame() {
    const playerNames = gameData.players.map(player => player.playerName);
    const newGameHistory = initializeNewGameHistory(gameData.numPlayers, playerNames);
    setGameHistory(newGameHistory);
    setGameInProgress(true);
  }

  // Automatically makes first available action: play / draw / pass
  function takeStep() {
    const updatedGameHistory = simulateOneAction(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
    if( updatedGameHistory.actions[updatedGameHistory.actions.length - 1].actionType === 'end' ) {
      setGameInProgress(false);
    }
  }

  function pushAction(action: Action) {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };
    setGameHistory(updatedGameHistory);
  }

  // Automate computer plays
  useEffect(() => {
    if( gameInProgress ) {
      const activePlayerName = gameState.playerNames[gameState.activePlayer];
      if( activePlayerName.startsWith("Computer")) {
        const timer = setTimeout(() => {
          takeStep();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameInProgress, gameHistory.actions]);

  // Determine the button label and onClick handler based on the game state
  function getButtonLabel(gameState: GameState) {
    if( gameState.gameBoard.size === 0) {
      return "START GAME";
    } else if( gameHistory.actions[gameHistory.actions.length - 1].actionType === 'end' ) {
      return "NEW GAME";
    } else {
      return gameState.tilesDrawnThisTurn < MAX_DRAW && gameState.drawPile.length > 0 ? "DRAW" : "PASS";
    }
  }

  function getButtonClick(gameState: GameState) {
    if( gameState.gameBoard.size === 0 || gameHistory.actions[gameHistory.actions.length - 1].actionType === 'end' ) {
      return startNewGame;
    } else {
      return takeStep;
    }
  }

  return (
    <main>
        <div className="left-container">
        <CopyToClipboard toCopy={gameData.gameID}/>
          <div className="buttons-container">
            <button className="button"
            onClick={getButtonClick(gameState)}
            disabled={gameHistory.actions[gameHistory.actions.length - 1].actionType !== 'end' && gameState.activePlayer !== playerIndex}
          >
            {getButtonLabel(gameState)}
          </button>
          </div>
          <GameBoardView 
            gameState={gameState}
            tileInHand={tileInHand}
            setTileInHand={setTileInHand}
            pushAction={pushAction}
          />
          <div className="bottom-container">
            <DisplayHand 
                playerIndex={playerIndex}
                gameState={gameState} 
                tileInHand={tileInHand}
                setTileInHand={setTileInHand}
            />
          </div>
        </div>
      <div className="right-container">
        <DisplayScores
          gameState={gameState}
        />
        <DisplayGameLog
          gameState={gameState}
        />
        <ChatComponent
          playerName={playerName}
          playerIndex={playerIndex}/>
      </div>
    </main>
  );
}