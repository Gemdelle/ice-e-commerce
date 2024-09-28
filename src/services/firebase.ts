import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBfAfgUFW0Ix2iDJAoGSoYfLI7tXdybaeU",
    authDomain: "ice-e-commerce.firebaseapp.com",
    projectId: "ice-e-commerce",
    storageBucket: "ice-e-commerce.appspot.com",
    messagingSenderId: "692648489099",
    appId: "1:692648489099:web:c271a592768f7dfc12248e",
    measurementId: "G-NM6WPYRZRX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);