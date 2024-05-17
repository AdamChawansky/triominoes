import { get, getDatabase, ref, serverTimestamp, set } from "firebase/database";
import { firebaseApp } from "./firebaseApp";
import { FirebaseGameData, GameHistory } from "../game/types";

// https://console.firebase.google.com/u/0/project/triominoes-7043f/database/triominoes-7043f-default-rtdb/data

export function saveGameData(gameData: FirebaseGameData) {
  // FOR PAUL: How come I had to remove the firebaseApp from argument? It was messing up the database save structure...
  const db = getDatabase();
  const gameDataRef = ref(db, `games/${gameData.gameID}`);
  set(gameDataRef, gameData);
  console.log('Game data saved at ' + Date.now());
}

export async function getGameData(gameId: string): Promise<FirebaseGameData> {
  const db = getDatabase();
  const gameDataRef = ref(db, `games/${gameId}`);
  const snapshot = await get(gameDataRef);
  console.log('Game data accessed at ' + Date.now());
  return snapshot.exists() ? snapshot.val() : null;
}


/*  THESE ARE THE INTRO FUNCTIONS THAT PAUL SET ME UP WITH TO DEMO FIREBASE
    THEY ARE NOT USED IN THE FINAL CODE */
export function setMessage(message: string) {
  const db = getDatabase(firebaseApp); // grabs root of database from firebase App
  const messageRef = ref(db, "message"); // grabs the pointer to key "message" in database
  set(messageRef, message);

  // No SQL is essentially a hash table version of a database
  // MySQL / postgres / SQL lite are implementations of SQL
}

export async function getMessage(): Promise <GameHistory> {
  const db = getDatabase(firebaseApp); // grabs root of database from firebase App
  const messageRef = ref(db, "message"); // grabs the pointer to key "message" in database
  const snapshot = await get(messageRef);
  return snapshot.val();
}