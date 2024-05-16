import { get, getDatabase, ref, set } from "firebase/database";
import { firebaseApp } from "./firebaseApp";

// https://console.firebase.google.com/u/0/project/triominoes-7043f/database/triominoes-7043f-default-rtdb/data

export function setMessage(message: string) {
  const db = getDatabase(firebaseApp); // grabs root of database from firebase App
  const messageRef = ref(db, "message"); // grabs the pointer to key "message" in database
  set(messageRef, message);

  // No SQL is essentially a hash table version of a database
  // MySQL / postgres / SQL lite are implementations of SQL
}

export async function getMessage(): Promise <string> {
  const db = getDatabase(firebaseApp); // grabs root of database from firebase App
  const messageRef = ref(db, "message"); // grabs the pointer to key "message" in database
  const snapshot = await get(messageRef);
  return snapshot.val();
}