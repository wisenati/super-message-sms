import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCgOvIkDCcS3DFrt5f6Y7pYmjCoHIfDF9U",
  authDomain: "moniebase-b4b4d.firebaseapp.com",
  projectId: "moniebase-b4b4d",
  storageBucket: "moniebase-b4b4d.appspot.com",
  messagingSenderId: "1009678808253",
  appId: "1:1009678808253:android:ff94e94c52bad2db7973d4",
  databaseURL: "https://moniebase-b4b4d-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Realtime Database
const database = getDatabase(app);

export { app, auth, database };
