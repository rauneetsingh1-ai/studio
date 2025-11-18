'use client';

import {
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase';

/**
 * Creates a new user document in Firestore.
 * This function is called when a new user signs up.
 * It uses a non-blocking write to Firestore.
 *
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 * @param extraData - Any extra data to add to the user document.
 */
export function createUserDoc(
  firestore: Firestore,
  user: User,
  extraData = {}
) {
  const userRef = doc(firestore, 'users', user.uid);

  const userData = {
    id: user.uid, // Add the user's UID to the document
    name: user.displayName || '',
    email: user.email,
    photoURL: user.photoURL || '',
    roles: [],
    skills: [],
    availability: {},
    badges: [],
    createdAt: serverTimestamp(),
    ...extraData,
  };

  // Use a non-blocking call to set the document
  setDocumentNonBlocking(userRef, userData, { merge: true });
}
