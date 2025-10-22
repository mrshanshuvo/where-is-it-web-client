import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { axiosInstance } from "../../api/api";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase auth info
  const [user, setUser] = useState(null); // Backend user info
  const [authChecked, setAuthChecked] = useState(false);

  // Backend authentication
  const handleBackendAuth = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();

    const res = await axiosInstance.post(
      "/users/firebase-login",
      { idToken },
      { withCredentials: true }
    );

    // Return the backend user directly
    return res.data.user;
  };
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const backendUser = await handleBackendAuth(userCredential.user);
      setFirebaseUser(userCredential.user);
      setUser(backendUser);
      return backendUser;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const backendUser = await handleBackendAuth(result.user);
      setFirebaseUser(result.user);
      setUser(backendUser);
      return backendUser;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });
      setFirebaseUser(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser || null);
      if (currentUser) {
        try {
          const backendUser = await handleBackendAuth(currentUser);
          setUser(backendUser);
        } catch (err) {
          console.error("Backend sync error:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthChecked(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    loading: loading || !authChecked,
    firebaseUser, // Use for token
    user, // Use for app logic
    setUser, // Important for SocialLogin
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
