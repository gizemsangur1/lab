import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDb5pW0kp5jVD90Z5OBHjWmZp8xfBesi00",
  authDomain: "mobil-lab-a1339.firebaseapp.com",
  projectId: "mobil-lab-a1339",
  storageBucket: "mobil-lab-a1339.appspot.com",
  messagingSenderId: "211550005985",
  appId: "1:211550005985:web:38752e06a51ff46384e5a0",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app); // Firestore nesnesi
export const auth = getAuth(app); // Auth nesnesi
