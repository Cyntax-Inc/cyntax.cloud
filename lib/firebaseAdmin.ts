import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app: App;

function initFirebaseAdmin() {
  if (getApps().length) {
    return getApps()[0]!;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountJson) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY env var (service account JSON)."
    );
  }

  let serviceAccount: any;

  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (e) {
    console.error("[firebaseAdmin] Failed to parse service account JSON");
    throw e;
  }

  if (serviceAccount.private_key?.includes("\\n")) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

app = initFirebaseAdmin();

export const db = getFirestore(app);
export const adminAuth = getAuth(app);
export const adminApp = app;