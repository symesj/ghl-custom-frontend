import { initializeApp } from "firebase/app";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-j044V8q_sn8_-Jb9fTIVv1vSRfjvWdo",
  authDomain: "fast-ai-boss.firebaseapp.com",
  projectId: "fast-ai-boss",
  storageBucket: "fast-ai-boss.firebasestorage.app",
  messagingSenderId: "1058395504296",
  appId: "1:1058395504296:web:1c0197b4a9776ed12a0c9d",
  measurementId: "G-7TC6PMSPDV"
};

// ✅ Export it once, clean and direct
export const app = initializeApp(firebaseConfig);
