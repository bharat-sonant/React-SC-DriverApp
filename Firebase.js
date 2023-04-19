import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDeXxTjfOxqunUgeqXnzdUo3GB2740mSLA",
  authDomain: "wevoisvm-d2596.firebaseapp.com",
  databaseURL: "https://wevois-kabari-development.firebaseio.com",
  projectId: "wevoisvm-d2596",
  storageBucket: "wevoisvm-d2596.appspot.com",
  messagingSenderId: "309054076294",
  appId: "1:309054076294:web:d72221799ecaa06089a807"
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);