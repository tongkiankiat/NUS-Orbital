// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeSxUtt8mdWii85NPyY_jc2B-hq07vl3Y",
  authDomain: "nutrisync2.firebaseapp.com",
  projectId: "nutrisync2",
  storageBucket: "nutrisync2.appspot.com",
  messagingSenderId: "567003571742",
  appId: "1:567003571742:web:ba601b1653338478ca300f",
  measurementId: "G-YD0H8YL3RB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const firebase_auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { collection };  