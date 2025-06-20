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
      const idToken = await userCredential.user.getIdToken();
      const displayName = userCredential.user.displayName || "";

      await axios.post(
        "http://localhost:5000/api/users/firebase-login",
        { idToken, name: displayName },
        { withCredentials: true }
      );

      const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
        withCredentials: true,
      });

      // Merge backend profile with Firebase user
      setUser({
        ...userCredential.user,
        name: profileRes.data.name,
        uid: profileRes.data.uid,
      });

      console.log("Backend profile:", profileRes.data);
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await axios.post(
        "http://localhost:5000/api/users/firebase-login",
        { idToken },
        { withCredentials: true }
      );

      const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
        withCredentials: true,
      });

      // Merge backend profile with Firebase user
      setUser({
        ...result.user,
        name: profileRes.data.name,
        uid: profileRes.data.uid,
      });

      console.log("Backend profile:", profileRes.data);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();

          await axios.post(
            "http://localhost:5000/api/users/firebase-login",
            { idToken },
            { withCredentials: true }
          );

          const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
            withCredentials: true,
          });

          // Merge backend profile with Firebase user
          setUser({
            ...currentUser,
            name: profileRes.data.name,
            uid: profileRes.data.uid,
          });

          console.log("Backend profile:", profileRes.data);
        } catch (error) {
          console.error("Error syncing auth with backend:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    loading,
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
