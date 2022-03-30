// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase, ref } from "firebase/database";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
...
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
