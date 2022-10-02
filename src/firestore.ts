import * as firebaseAdmin from 'firebase-admin/app';
import * as firestoreAdmin from 'firebase-admin/firestore';

firebaseAdmin.initializeApp();
export const firestore = firestoreAdmin.getFirestore();
