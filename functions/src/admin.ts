import * as admin from "firebase-admin";

export const adminApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp();

export const db = adminApp.firestore();
