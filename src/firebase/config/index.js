// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATxz-vUT8iPkw0bUyJond3dnhVwbrNLdE",
    authDomain: "image-editing-app-b8f68.firebaseapp.com",
    projectId: "image-editing-app-b8f68",
    storageBucket: "image-editing-app-b8f68.appspot.com",
    messagingSenderId: "413272374098",
    appId: "1:413272374098:web:c7cf5a6a004598c449588b"
};

// Initialize Firebase
const MY_APP = initializeApp(firebaseConfig);

export default MY_APP