import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
}

if (!authDomain) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
}

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Failed to set Firebase auth persistence:", error);
});