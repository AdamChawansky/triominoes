import { useEffect, useState } from 'react';
import { eraseGameHistory, initializeNewGameHistory, simulateCompleteGame, simulateOneAction } from '../game/generator.ts';
import { replayHistory } from '../game/history.ts';
import { Action, FirebaseGameData, GameHistory, NewTile } from '../game/types.ts';
import { firebaseSaveGameData, firebaseSubscribeGameData } from '../online/firebaseApi.ts';
import { DisplayHand } from './DisplayHand.tsx';
import { DisplayGameLog } from './DisplayLog.tsx';
import { DisplayScores } from './DisplayScores.tsx';
import './RootDisplay.css';
import { GameBoardView } from './DisplayGameBoard.tsx';
import ChatComponent from './ChatComponent.tsx';
import { CopyToClipboard } from '../online/CopyToClipboard.tsx';

export function Admin(props: {
  initialGameData: FirebaseGameData,
  localPlayerID: string,
}) {
  // local state
  const [gameData, setGameData] = useState<FirebaseGameData>(props.initialGameData);
  const [tileInHand, setTileInHand] = useState<NewTile | undefined>();
  
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

  const playerIndex = gameData.players.findIndex((player) => player.localPlayerID === props.localPlayerID);
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
  }

  function resetGame() {
    const resetGameHistory = eraseGameHistory(gameData.gameHistory);
    setGameHistory(resetGameHistory);
  }

  function performUndo() {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions[gameData.gameHistory.actions.length - 1].actionType === 'init'
      ? gameData.gameHistory.actions
      : gameData.gameHistory.actions.slice(0, -1),
    };
    setGameHistory(updatedGameHistory);
  }

  function takeStep() {
    const updatedGameHistory = simulateOneAction(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
  }

  function simulate() {
    const updatedGameHistory = simulateCompleteGame(gameData.gameHistory);
    setGameHistory(updatedGameHistory);
  }

  function pushAction(action: Action) {
    const updatedGameHistory = {
      startingDeck: gameData.gameHistory.startingDeck,
      actions: gameData.gameHistory.actions.concat(action),
    };
    setGameHistory(updatedGameHistory);
  }

  return (
    <main>
        <div className="left-container">
        <CopyToClipboard toCopy={gameData.gameID}/>
          <div className="buttons-container">
            <button className="button" onClick={startNewGame}>RESTART GAME</button>
            <button className="button" onClick={resetGame}>RESET GAME</button>
            <button className="button" onClick={performUndo}>UNDO</button>
            <button className="button" onClick={takeStep}>STEP</button>
            <button className="button" onClick={simulate}>SIMULATE!</button>
          </div>
          <GameBoardView 
            gameState={gameState}
            tileInHand={tileInHand}
            setTileInHand={setTileInHand}
            pushAction={pushAction}
            isActivePlayer={gameState.activePlayer === playerIndex}
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
          playerIndex={playerIndex}
          gameData={gameData}
        />
      </div>
    </main>
  );
}