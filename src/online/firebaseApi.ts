import { get, getDatabase, ref, set } from "firebase/database";
import { firebaseApp } from "./firebaseApp";
import { GameHistory } from "../game/types";

// https://console.firebase.google.com/u/0/project/triominoes-7043f/database/triominoes-7043f-default-rtdb/data

export function saveGameHistory(gameId: string, gameHistory: GameHistory) {
  const db = getDatabase(firebaseApp);
  const gameHistoryRef = ref(db, `games/${gameId}/history`);
  set(gameHistoryRef, gameHistory);
}

export async function getGameHistory(gameId: string): Promise<GameHistory> {
  const db = getDatabase(firebaseApp);
  const gameHistoryRef = ref(db, `games/${gameId}/history`);
  const snapshot = await get(gameHistoryRef);
  return snapshot.exists() ? snapshot.val() : null;
}


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