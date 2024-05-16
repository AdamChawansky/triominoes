import { useState } from 'react';
import './App.css'
import { RootDisplay } from './components/RootDisplay'
import { getMessage, setMessage } from './online/firebaseApi';

(window as any).fbapi = {
  setMessage,
  getMessage,
};

/* App runs a function and returns something that looks like HTML */
function App() {
  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameStatus, setGameStatus] = useState<'landing' | 'newGame' | 'joinGame' | 'gameStarted'>('landing');

  const handleCreateNewGame = () => {
    setGameStatus('newGame');
  };

  const handleJoinExistingGame = () => {
    setGameStatus('joinGame');
  };

  const handleStartGame = () => {
    if (numPlayers !== undefined && playerName.trim() !== '') {
      setGameStatus('gameStarted');
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
      <div>
        <h2>Create New Game</h2>
        <label>
          Number of Players:
          <select value={numPlayers} onChange={(n) => setNumPlayers(Number(n.target.value))}>
            <option value="">Select number of players</option>
            {[...Array(6)].map((_, i) => (
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
            type="text"
            value={playerName}
            onChange={(s) => setPlayerName(s.target.value)}
          />
        </label>
        <br />
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    );
  } else if (gameStatus === 'joinGame') {
    return (
      <div>
          <h2>Join a Game</h2>
          <label>
              Game ID:
              <input type="text" value={gameId} onChange={(s) => setGameId(s.target.value)}/>
          </label>
          <br />
          <button onClick={handleJoinExistingGame}>Join Game</button>
      </div>
    );
  } else if (gameStatus === 'gameStarted') {
    return <RootDisplay numPlayers={numPlayers!} playerName={playerName}/>;
  } else {
    console.log("Invalid Game Status");
    return null;
  }
}

export default App