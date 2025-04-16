// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD1PdpuW0WkZbQytZfYSJQ1JCeqcr4DNCE",
    authDomain: "high-low-game-ff568.firebaseapp.com",
    projectId: "high-low-game-ff568",
    storageBucket: "high-low-game-ff568.firebasestorage.app",
    messagingSenderId: "459362458752",
    appId: "1:459362458752:web:c151ad73644cfe3b281a65"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };