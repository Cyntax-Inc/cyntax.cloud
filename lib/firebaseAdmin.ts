import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountJson) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY env var (service account JSON)."
    );
  }

  let serviceAccount: any;

  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error("[firebaseAdmin] Failed to parse service account JSON");
    throw error;
  }

  if (serviceAccount.private_key?.includes("\\n")) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  return serviceAccount;
}

function initFirebaseAdmin(): App {
  if (getApps().length) {
    return getApps()[0]!;
  }

  const serviceAccount = getServiceAccount();

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getAdminApp(): App {
  return initFirebaseAdmin();
}

export function getDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export const adminApp = new Proxy({} as App, {
  get(_target, prop) {
    return Reflect.get(getAdminApp() as object, prop);
  },
});

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_target, prop) {
    return Reflect.get(getDb() as object, prop);
  },
});

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop) {
    return Reflect.get(getAdminAuth() as object, prop);
  },
});