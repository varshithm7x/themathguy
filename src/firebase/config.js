import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqlKqCH52DVyvLg2DMOYO121ABjceSjkY",
  authDomain: "themathguy-b39bc.firebaseapp.com",
  projectId: "themathguy-b39bc",
  storageBucket: "themathguy-b39bc.firebasestorage.app",
  messagingSenderId: "252083625732",
  appId: "1:252083625732:web:732f97e633a4ee13247a51",
  measurementId: "G-2HYYQPV3TK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };