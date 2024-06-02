// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBijMUaU_R0MF4buVsHt78Skt0-NHGM6Mk",
  authDomain: "nutrisync-cc928.firebaseapp.com",
  projectId: "nutrisync-cc928",
  storageBucket: "nutrisync-cc928.appspot.com",
  messagingSenderId: "49076525804",
  appId: "1:49076525804:web:56d9f2bc579fc25edce3c9",
  measurementId: "G-3W24S990FV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const firebase_auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { collection };