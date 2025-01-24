import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASySqzcw9RLTcOZOR-FmPSrz0prt1Ixss",
  authDomain: "alhamdmobiles-5938b.firebaseapp.com",
  databaseURL:
    "https://alhamdmobiles-5938b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alhamdmobiles-5938b",
  storageBucket: "alhamdmobiles-5938b.firebasestorage.app",
  messagingSenderId: "714728448305",
  appId: "1:714728448305:web:4d7f1dc16cf752080d5010",
  measurementId: "G-J11G3KDKFJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
