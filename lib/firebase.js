// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { collection, getDoc, getDocs, getFirestore, query, where, limit, doc, serverTimestamp, onSnapshot } from "firebase/firestore"
import {getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjujaa08MNtHIpXbgh8xg9t4Phfu3rd6s",
  authDomain: "nextjs-demo-app-78181.firebaseapp.com",
  projectId: "nextjs-demo-app-78181",
  storageBucket: "nextjs-demo-app-78181.appspot.com",
  messagingSenderId: "554769850379",
  appId: "1:554769850379:web:4e19c123b8c7cb9435e70e",
  measurementId: "G-Y5HVK7H9CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore();

export const serverTimestamps = serverTimestamp();
export const storage = getStorage(app);
export async function getUserWithUsername(username) {
  
  const userRef = query(collection(firestore, 'users'), where('username', "==", username), limit(1));
  const doc = await getDocs(userRef);
  let userDoc = null;
  doc.forEach((userDocs) => {
    userDoc = userDocs;
  })
  


  // const userDoc = querys.forEach((doc) => {
  //   console.log(doc.data())
  //   return doc.data();
  // });
  // const docRef = doc(firestore, "usernames", username);
  // const userDoc = await getDoc(docRef);
  return {userDoc, userRef};
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
}

export const didUserHeartedPost = async (ref) => {
  const file = await getDoc(ref).then((doc) => {
    return doc.data();
  });

}