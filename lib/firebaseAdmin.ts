// lib/firebaseAdmin.ts
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App | null = null;

function getFirebaseApp() {
  if (app) return app;

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
    console.error("[firebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY");
    throw e;
  }

  if (typeof serviceAccount.private_key !== "string") {
    throw new Error(
      "Service account JSON is missing a valid private_key field."
    );
  }

  // Handle escaped newlines if present
  if (serviceAccount.private_key.includes("\\n")) {
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n"
    );
  }

  if (getApps().length) {
    app = getApps()[0]!;
  } else {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return app;
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
