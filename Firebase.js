import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA38HQjXpbRQrghpS0OmSK8gq_MTYIudVM",
  authDomain: "passa-chat-app.firebaseapp.com",
  projectId: "passa-chat-app",
  storageBucket: "passa-chat-app.appspot.com",
  messagingSenderId: "701037669300",
  appId: "1:701037669300:web:21d0a0897b0a9d95d1a0e1",
};
// const firebaseConfig = {
//     apiKey: "AIzaSyCzPND6AOmN8-Vp-wpIwHALTXl5ix0HdEc",
//     authDomain: "passa-chat-android-app.firebaseapp.com",
//     databaseURL: "https://passa-chat-android-app-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "passa-chat-android-app",
//     storageBucket: "passa-chat-android-app.appspot.com",
//     messagingSenderId: "199291038785",
//     appId: "1:199291038785:web:579a7d611999cb1dbfaac0"
// };

let firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app(); // if already initialized, use that one
}

const db = firebaseApp.firestore();
const authentication = firebaseApp.auth();

export { db, authentication };
