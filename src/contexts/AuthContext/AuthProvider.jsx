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

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send Firebase ID token to backend to create backend JWT cookie
      await axios.post(
        "http://localhost:5000/api/users/firebase-login",
        { idToken },
        { withCredentials: true }
      );

      // Fetch backend user profile
      const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
        withCredentials: true,
      });

      setUser(userCredential.user);
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

      setUser(result.user);
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
      if (currentUser) {
        setLoading(true);
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

          setUser(currentUser);
          console.log("Backend profile:", profileRes.data);
        } catch (error) {
          console.error("Error syncing auth with backend:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
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
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
