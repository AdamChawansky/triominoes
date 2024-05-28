import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { FirebaseGameData } from "../game/types";
import { firebaseApp } from "./firebaseApp";

// https://console.firebase.google.com/u/0/project/triominoes-7043f/database/triominoes-7043f-default-rtdb/data

function sanitizeGameData(raw: FirebaseGameData): FirebaseGameData {
  return {
    ...raw,
    gameHistory: {
      ...raw.gameHistory,
      startingDeck: raw.gameHistory?.startingDeck ?? [],
      actions: raw.gameHistory?.actions ?? [],
    },
    players: raw.players ?? [], // if first element is undefined or null, return the second element
    messageHistory: raw.messageHistory ?? {messages: []},
  };
}

export function firebaseSaveGameData(gameData: FirebaseGameData) {
  const db = getDatabase(firebaseApp);
  const gameDataRef = ref(db, `games/${gameData.gameID}`);
  set(gameDataRef, gameData);
  // console.log('Game data saved at ' + Date.now());
}

export async function firebaseGetGameData(gameId: string): Promise<FirebaseGameData | null> {
  const db = getDatabase(firebaseApp);
  const gameDataRef = ref(db, `games/${gameId}`);
  const snapshot = await get(gameDataRef);
  console.log('Game data accessed at ' + Date.now());
  return snapshot.exists() ? sanitizeGameData(snapshot.val()) : null;
}

export async function firebaseSubscribeGameData(
  initialGameData: FirebaseGameData,
  callback: (gameData: FirebaseGameData) => void,
): Promise<void> {
  const db = getDatabase(firebaseApp);
  const gameDataRef = ref(db, `games/${initialGameData.gameID}`);
  const snapshot = await get(gameDataRef);
  if (!snapshot.exists()) {
    // we got here first, so lets populate the DB
    await set(gameDataRef, initialGameData);
  }
  
  onValue(gameDataRef, snapshot => {
    callback(sanitizeGameData(snapshot.val()));
  });
}