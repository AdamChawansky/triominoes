import { useState } from 'react';
import './App.css'
import { RootDisplay } from './components/RootDisplay'
import { getMessage, setMessage } from './online/firebaseApi';
import { QueryParam } from './game/types';

(window as any).fbapi = {
  setMessage,
  getMessage,
};

/* App runs a function and returns something that looks like HTML */
function App() {
  const searchParams = new URLSearchParams(window.location.search);
  let gameID = searchParams.get(QueryParam.GameID);
  const playerID = new Date().getTime().toString();

  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameStatus, setGameStatus] = useState<'landing' | 'newGame' | 'joinGame' | 'enterRoom'>('landing');

  const handleCreateNewGame = () => {
    setGameStatus('newGame');
  };

  const handleJoinExistingGame = () => {
    setGameStatus('joinGame');
  };

  const handleCreateRoom = () => {
    if (gameID) {
      setGameStatus('enterRoom');
    } else if (numPlayers !== undefined && !isNaN(numPlayers) && playerName.trim() !== '') {
      // generate random string to be gameID
      gameID = "garage";
      setGameStatus('enterRoom');
    }
  };

  if (gameStatus === 'landing') {
    return (
      <div className="loading-screen">
        <h1>Let's play Triominoes!</h1>
        <button className="button" onClick={handleCreateNewGame}>Create New Game</button>
        <button className="button" onClick={handleJoinExistingGame}>Join a Game</button>
      </div>
    );
  } else if (gameStatus === 'newGame') {
    return (
      <div className="loading-screen">
        <h2>Create New Game</h2>
        <label>
          Number of Players:
          <select
            className="input-field"
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}>
            <option value="">Select number of players</option>
              {[...Array(6)].map((_,i) => (
              <option key={i+1} value={i+1}>
                {i+1}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Player Name: 
          <input
            className="input-field"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <br />
        <button className="button" onClick={handleCreateRoom}>Create Room</button>
      </div>
    );
  } else if (gameStatus === 'joinGame') {
    // FOR LATER: Add ability for URL to automatically take you to 'joinGame' and populate Game ID
    return (
      <div className="loading-screen">
          <h2>Join a Game</h2>
          <label>
              Game ID:
              <input className="input-field" type="text" value={gameId} onChange={(e) => setGameId(e.target.value)}/>
          </label>
          <br />
          <label>
          Player Name: 
          <input
            className="input-field"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <br />
          <button className="button" onClick={handleJoinExistingGame}>Join Game</button>
      </div>
    );
  } else if (gameStatus === 'enterRoom') {
    return <RootDisplay gameID={gameID!} numPlayers={numPlayers!} playerName={playerName}/>;
  } else {
    console.log("Invalid Game Status");
    return null;
  }
}

export default App