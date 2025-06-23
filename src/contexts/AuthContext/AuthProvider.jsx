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
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Common function to handle backend authentication
  const handleBackendAuth = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const displayName = firebaseUser.displayName || "";

      // Send to backend for verification and session creation
      const response = await axios.post(
        "https://whereisit-server-inky.vercel.app/api/users/firebase-login",
        { idToken, name: displayName },
        { withCredentials: true }
      );

      // Return combined user data
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: displayName,
        // Include any additional data from backend if needed
        ...(response.data.user || {}),
      };
    } catch (error) {
      console.error("Backend auth error:", error);
      throw error;
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) => {
    if (!auth.currentUser) return Promise.reject("No user logged in");
    return auth.currentUser.updateProfile(profile);
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await handleBackendAuth(userCredential.user);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await handleBackendAuth(result.user);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Google sign-in error:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await axios.post(
        "https://whereisit-server-inky.vercel.app/api/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userData = await handleBackendAuth(currentUser);
          setUser(userData);
        } catch (error) {
          console.error("Error syncing auth with backend:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthChecked(true);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    loading: loading || !authChecked,
    user,
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;