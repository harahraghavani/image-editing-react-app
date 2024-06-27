// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKFqi2so0eQxZVQpxUgvSy4z-cxn1tQ-8",
  authDomain: "image-editing-react-app.firebaseapp.com",
  projectId: "image-editing-react-app",
  storageBucket: "image-editing-react-app.appspot.com",
  messagingSenderId: "393939931784",
  appId: "1:393939931784:web:ba32913339a85fec64c53d",
};

// Initialize Firebase
const MY_APP = initializeApp(firebaseConfig);

export default MY_APP;
