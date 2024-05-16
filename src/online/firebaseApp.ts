// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRqtCuq9ts7KqT-NS3_akHjZQoiiuf2X4", // this is a security vulnerability, dummy
  authDomain: "triominoes-7043f.firebaseapp.com",
  databaseURL: "https://triominoes-7043f-default-rtdb.firebaseio.com",
  projectId: "triominoes-7043f",
  storageBucket: "triominoes-7043f.appspot.com",
  messagingSenderId: "824630932052",
  appId: "1:824630932052:web:9cf65f50a6c9280f6b33c1",
  measurementId: "G-QDV767XXJE"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);