import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGExp0-DZcPZ9yQSmBkhsI4SNbz2HsyZk",
  authDomain: "test1-ed9d0.firebaseapp.com",
  projectId: "test1-ed9d0",
  storageBucket: "test1-ed9d0.appspot.com",
  messagingSenderId: "226967275488",
  appId: "1:226967275488:web:081174010da4c8adba8d85",
  measurementId: "G-4D9E8WXKMM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;