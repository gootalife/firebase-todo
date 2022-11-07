import { initializeApp, getApps } from 'firebase/app'
import { getAuth, browserSessionPersistence, setPersistence, GoogleAuthProvider, signInWithPopup, TwitterAuthProvider, User } from 'firebase/auth'
import router from 'next/router'
import { path } from './path'
import { destroyCookie } from 'nookies';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

export const auth = getAuth()

setPersistence(auth, browserSessionPersistence)

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch {
  }
}

export const signInWithTwitter = async () => {
  const provider = new TwitterAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch {
  }
}

export const logout = async () => {
  destroyCookie(null, 'accessToken')
  await auth.signOut()
  await router.push(path.home)
}

export type UserOrNull = User | null;