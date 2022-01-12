// import * as firebase from 'firebase'

// const firebaseConfig = {
//     apiKey: "AIzaSyCcAOwdLTLXmNZ7zCy-1X3ynWkFH2AGBT4",
//     authDomain: "signal-v2.firebaseapp.com",
//     projectId: "signal-v2",
//     storageBucket: "signal-v2.appspot.com",
//     messagingSenderId: "882317468319",
//     appId: "1:882317468319:web:fc67e23a3ee92c4c48b8aa",
//     measurementId: "G-4MX5YB2QR9"
// };

// let app;

// if (firebase.apps.length === 0) app = firebase.initializeApp(firebaseConfig);
// else app = firebase.app()

// const auth = firebase.auth()

// export { auth }

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as f from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCcAOwdLTLXmNZ7zCy-1X3ynWkFH2AGBT4",
    authDomain: "signal-v2.firebaseapp.com",
    projectId: "signal-v2",
    storageBucket: "signal-v2.appspot.com",
    messagingSenderId: "882317468319",
    appId: "1:882317468319:web:fc67e23a3ee92c4c48b8aa",
    measurementId: "G-4MX5YB2QR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = f

export { auth }