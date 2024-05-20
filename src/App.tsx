import { useState } from 'react';
import './App.css';
import { RootDisplay } from './components/RootDisplay';
import { FirebaseGameData, QueryParam } from './game/types';
import { firebaseGetGameData, firebaseSaveGameData } from './online/firebaseApi';

(window as any).fbapi = {
  saveGameData: firebaseSaveGameData,
  getGameData: firebaseGetGameData,
};

function generateGameID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let gameID = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    gameID += characters[randomIndex];
  }
  return gameID;
}

/* App runs a function and returns something that looks like HTML */
function App() {
  const searchParams = new URLSearchParams(window.location.search);
  let gameIDFromURL = searchParams.get(QueryParam.gameID);
  const playerID = new Date().getTime().toString();

  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState('');
  const [gameID, setGameID] = useState(gameIDFromURL || '');
  const [gameStatus, setGameStatus] = useState<'landing' | 'newGame' | 'joinGame' | 'enterRoom'>('landing');
  const [initialGameData, setInitialGameData] = useState<FirebaseGameData | null>(null);

  // Player selects "Create New Game"
  const handleCreateNewGame = () => {
    setGameStatus('newGame');
  };

  // Player selects "Join a Game"
  const handleJoinExistingGame = () => {
    setGameStatus('joinGame');
  };
  
  // Player uses link with gameID alread included
  if (gameIDFromURL) {
    setGameStatus('joinGame');
    setGameID(gameIDFromURL);
  }

  // Player is creating a new game
  const handleEnterNewRoom = async () => {
    if (numPlayers && !isNaN(numPlayers) && playerName.trim() !== '') {
      // Generate random string to be gameID
      const newGameID = generateGameID();
      setGameID(newGameID);
      console.log('New room created: ' + newGameID);

      // Create a new FirebaseGameData object
      const newGameData: FirebaseGameData = {
        gameID: newGameID,
        numPlayers: numPlayers,
        gameHistory: {
          startingDeck: [],
          actions: [],
        },
        players: [ {playerID: playerID, playerName: playerName} ],
      };
      
      // Later, up-sert the playerName
      setInitialGameData(newGameData);
      setGameStatus('enterRoom');
    }
  };

  // Player is joining an existing game
  const handleEnterExistingRoom = async () => {
    if (gameID !== '' && playerName.trim() !== '') {
      // Retrieve the existing game data
      const existingGameData = await firebaseGetGameData(gameID);
      if (existingGameData) {
        // Add the new player to the humanPlayers array & AddPlayer action
        const updatedGameData: FirebaseGameData = {
          ...existingGameData,
          players: [...existingGameData.players, {
            playerID: playerID,
            playerName: playerName,
          }],
        };

        // Save the updated game data to Firebase
        await firebaseSaveGameData(updatedGameData);

        // get to RootDisplay
        setInitialGameData(updatedGameData);
        setGameStatus('enterRoom');
      } else {
        console.log('Invalid Game ID');
      }
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
  } 
  if (gameStatus === 'newGame') {
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
        <button className="button" onClick={handleEnterNewRoom}>Create Room</button>
      </div>
    );
  }
  
  if (gameStatus === 'joinGame') {
    // FOR LATER: Add ability for URL to automatically take you to 'joinGame' and populate Game ID
    return (
      <div className="loading-screen">
          <h2>Join a Game</h2>
          <label>
              Game ID:
              <input className="input-field" type="text" value={gameID} onChange={(e) => setGameID(e.target.value)}/>
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
          <button className="button" onClick={handleEnterExistingRoom}>Join Game</button>
      </div>
    );
  }
  
  if (gameStatus === 'enterRoom' && initialGameData) {
    return <RootDisplay initialGameData={initialGameData} localPlayerID={playerID}/>;
  }

  // else
  console.log("Invalid Game Status");
  return null;
}

export default App