import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDXv7YS5OPeDSBcBDIRHSiV6EcdzueweEQ",
    authDomain: "chousei-app-e8fc8.firebaseapp.com",
    projectId: "chousei-app-e8fc8",
    storageBucket: "chousei-app-e8fc8.firebasestorage.app",
    messagingSenderId: "418691796814",
    appId: "1:418691796814:web:b58803c5f141d535c0181f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
