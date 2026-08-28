import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP3w7R8PIQLvvw74xJWT1YBu6xQlipKB8",
  authDomain: "sps-website-1bbf9.firebaseapp.com",
  projectId: "sps-website-1bbf9",
  storageBucket: "sps-website-1bbf9.firebasestorage.app",
  messagingSenderId: "206564245686",
  appId: "1:206564245686:web:2a4f47b0f75b7e3e58e617",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
