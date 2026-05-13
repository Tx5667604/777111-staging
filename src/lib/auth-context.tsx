// src/lib/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { initFirebase } from "./firebase";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  phone?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Завантажити профіль з Firestore
  const loadProfile = useCallback(async (uid: string) => {
    try {
      const { db } = initFirebase();
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }, []);

  // Зберегти/оновити профіль при вході
  const saveProfile = useCallback(async (firebaseUser: User) => {
    try {
      const { db } = initFirebase();
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      const profileData: Partial<UserProfile> = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Користувач",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL,
        lastLogin: new Date(),
      };

      if (!docSnap.exists()) {
        profileData.createdAt = new Date();
        profileData.phone = "";
      }

      await setDoc(docRef, profileData, { merge: true });
      setProfile(profileData as UserProfile);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }, []);

  useEffect(() => {
    const { auth } = initFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile]);

  const loginWithGoogle = async () => {
    try {
      const { auth, googleProvider } = initFirebase();
      const result = await signInWithPopup(auth, googleProvider);
      await saveProfile(result.user);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Login error:", err);
      }
    }
  };

  const logout = async () => {
    const { auth } = initFirebase();
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
