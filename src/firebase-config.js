// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase, ref } from "firebase/database";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCDN-sciKFMrxtvrRl7vOssvEhSUqeMxWQ",
  authDomain: "ionic-app-project-c61c9.firebaseapp.com",
  databaseURL: "https://ionic-app-project-c61c9-default-rtdb.firebaseio.com",
  projectId: "ionic-app-project-c61c9",
  storageBucket: "ionic-app-project-c61c9.appspot.com",
  messagingSenderId: "66228423339",
  appId: "1:66228423339:web:4800724c8762d1d22285ee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const storage = getStorage(app);
export const postsRef = ref(database, "posts");
export const usersRef = ref(database, "users");
export const auth = getAuth(app);

export function getPostRef(postId) {
  return ref(database, "posts/" + postId);
}
export function getUserRef(uid) {
  return ref(database, "users/" + uid);
}
