// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjQig8qciXEb1inqiqROUsaf7dSZ758KM",
  authDomain: "projects-6f556.firebaseapp.com",
  projectId: "projects-6f556",
  storageBucket: "projects-6f556.appspot.com",
  messagingSenderId: "642831810220",
  appId: "1:642831810220:web:67a8cd596333cf61a66909"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const database = getFirestore(app)
export { app, database, storage}