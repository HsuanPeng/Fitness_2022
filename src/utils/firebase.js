import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtlWrSX2x1e0oTxI1_MN52sQsVyEwaOzA",
  authDomain: "fitness2-d4aaf.firebaseapp.com",
  projectId: "fitness2-d4aaf",
  storageBucket: "fitness2-d4aaf.appspot.com",
  messagingSenderId: "440863323792",
  appId: "1:440863323792:web:3f097801137f4002c7ca15",
};

const app = initializeApp(firebaseConfig);
export default firebaseConfig;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
