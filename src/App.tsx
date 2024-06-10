import { useEffect, useState } from 'react';
import './App.css';
import { RootDisplay } from './components/RootDisplay';
import { FirebaseGameData, QueryParam } from './game/types';
import { firebaseGetGameData, firebaseSaveGameData } from './online/firebaseApi';
import { Admin } from './components/Admin';

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

// Check if player ID exists in local storage
let playerID: string | null = localStorage.getItem('playerID');

// If player ID doesn't exist, generate a new one
if (!playerID) {
  playerID = generateUniqueID();
  localStorage.setItem('playerID', playerID);
}

// Function to generate a unique player ID
function generateUniqueID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c: string): string {
    const r: number = Math.random() * 16 | 0 // | 0 truncates number to an integer
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // extracts a number from 1000 to 1011 for y
    return v.toString(16);
  });
}

/* App runs a function and returns something that looks like HTML */
function App() {
  const searchParams = new URLSearchParams(window.location.search);
  let gameIDFromURL = searchParams.get(QueryParam.gameID);

  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState('');
  const [gameID, setGameID] = useState(gameIDFromURL || '');
  const [gameStatus, setGameStatus] = useState<'landing' | 'newGame' | 'joinGame' | 'enterRoom'>(gameIDFromURL ? 'joinGame' : 'landing');
  const [initialGameData, setInitialGameData] = useState<FirebaseGameData | null>(null);
  // console.log("gameStatus is ", gameStatus);

  const fetchGameData = async (gameID: string) => {
    const firebaseGameData = await firebaseGetGameData(gameID);
    if( firebaseGameData ) {
      setInitialGameData(firebaseGameData);
      setGameStatus('enterRoom');
    } else {
      console.log("Invalid game ID");
      setGameStatus('landing');
    }
  } 

  useEffect(() => {
    if( gameIDFromURL ) {
      fetchGameData(gameIDFromURL).then(() => {
        if( initialGameData && initialGameData.players.some(player => player.localPlayerID === playerID)) {
          setGameStatus('enterRoom');
        } else {
          setGameStatus('joinGame');
        }
      });
    }
  }, [gameIDFromURL]);

  // Player selects "Create New Game"
  const handleCreateNewGame = () => {
    setGameStatus('newGame');
  };

  // Player selects "Join a Game"
  const handleJoinExistingGame = () => {
    setGameStatus('joinGame');
  };

  // Player is creating a new game
  const handleEnterNewRoom = async () => {
    if (numPlayers && playerID && !isNaN(numPlayers) && playerName.trim() !== '') {
      // Generate random string to be gameID
      const newGameID = generateGameID();
      setGameID(newGameID);

      // Update the URL with the generated gameID
      const newUrl = `${window.location.origin}/triominoes/?gameID=${newGameID}`;
      window.history.pushState({ path: newUrl }, '', newUrl);

      // Create a new FirebaseGameData object
      const newGameData: FirebaseGameData = {
        gameID: newGameID,
        numPlayers: numPlayers,
        gameHistory: {
          startingDeck: [],
          actions: [{
            actionType: 'add-player',
            playerName: playerName,
            playerID: playerID,
          }],
        },
        players: [{
          localPlayerID: playerID || "null",
          playerName: playerName,
          playerType: 'human',
        }],
        gameInProgress: false,
        messageHistory: { messages: [] },
      };
      
      // Later, up-sert the playerName
      await firebaseSaveGameData(newGameData);
      await fetchGameData(newGameID);
      setGameStatus('enterRoom');
    }
  };

  // Player is joining an existing game
  const handleEnterExistingRoom = async () => {
    if (gameID !== '' && playerName.trim() !== '' && playerID) {
      // Retrieve the existing game data
      const existingGameData = await firebaseGetGameData(gameID);
      console.log(existingGameData);
      if( existingGameData ) {
        // Check if the player already exists in the game
        const existingPlayerIndex = existingGameData.players.findIndex(
          (player) => player.localPlayerID === playerID
        );

        if( existingPlayerIndex !== -1 ) {
          // Player already exists, update the playerName in add-player action & players
          const updatedGameData: FirebaseGameData = {
            ...existingGameData,
            gameHistory: {
              startingDeck: [...existingGameData.gameHistory.startingDeck],
              actions: existingGameData.gameHistory.actions.map((action) =>
                (action.actionType === 'add-player' && action.playerID === playerID)
                ? { ...action, playerName, playerID }
                : action
              ),
            },
            players: existingGameData.players.map((player, index) => 
              index === existingPlayerIndex
              ? { ...player, playerName }
              : player
            ),
          };
          // Save the updated game data to Firebase
          await firebaseSaveGameData(updatedGameData);
          setInitialGameData(updatedGameData);
        } else {
          // Player doesn't exist, add as a new player
          let playerType: 'human' | 'spectator';
          if( existingGameData.gameInProgress || existingGameData.players.length >= existingGameData.numPlayers) {
            playerType = 'spectator';
          } else {
            playerType = 'human';
          }

          const updatedGameData: FirebaseGameData = {
            ...existingGameData,
            gameHistory: playerType === 'human' ? {
              startingDeck: [...existingGameData.gameHistory.startingDeck],
              actions: [
                ...existingGameData.gameHistory.actions,
                { actionType: 'add-player',
                  playerName: playerName,
                  playerID: playerID,
                },
              ],
          } : existingGameData.gameHistory,
            players: [
              ...existingGameData.players,
              { localPlayerID: playerID || "null", playerName: playerName, playerType }
            ],
          };
          // Save the updated game data to Firebase
          await firebaseSaveGameData(updatedGameData);
          setInitialGameData(updatedGameData);
        }

        // get to RootDisplay
        setGameStatus('enterRoom');
      } else {
        console.log('Invalid Game ID');
      }
    }
  };

  if( gameStatus === 'enterRoom' && initialGameData ) {
    if (playerName==='admin') {
      return <Admin initialGameData={initialGameData} localPlayerID={playerID || "null"}/>;
    } else {
      return <RootDisplay initialGameData={initialGameData} localPlayerID={playerID || "null"}/>;
    }
  } else if (gameStatus === 'landing') {
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
        <button className="button" onClick={handleEnterNewRoom}>Create Room</button>
      </div>
    );
  } else if (gameStatus === 'joinGame') {
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
  
  // else
  console.log("Invalid Game Status");
  return null;
}

export default App