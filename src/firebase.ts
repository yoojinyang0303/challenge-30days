import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-SoxNW_ZlRoRmMSvExI58qEcEEXVbJ6Y",
  authDomain: "challenge-30days.firebaseapp.com",
  projectId: "challenge-30days",
  storageBucket: "challenge-30days.appspot.com",
  messagingSenderId: "450610343479",
  appId: "1:450610343479:web:1e129e01e4fbb6203a19b2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GithubAuthProvider,
};
