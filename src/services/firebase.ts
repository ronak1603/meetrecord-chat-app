import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDup3g99S-zkQgKYsUlANOdrBIitcRGsAo",
  authDomain: "chat-app-4d935.firebaseapp.com",
  projectId: "chat-app-4d935",
  storageBucket: "chat-app-4d935.appspot.com",
  messagingSenderId: "764307793134",
  appId: "1:764307793134:web:8a6c1bec57786e13f63fff",
  measurementId: "G-18SHNLP6PT",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth, app };
