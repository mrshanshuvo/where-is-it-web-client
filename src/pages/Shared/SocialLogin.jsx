import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useContext } from "react";

const SocialLogin = ({ from }) => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send the ID token to your backend
      const idToken = await user.getIdToken();

      const response = await fetch("/api/users/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          name: user.displayName,
        }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
        toast.success("Login successful");
        navigate(from || "/", { replace: true });
      } else {
        throw new Error(data.message || "Google login failed");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="mt-6">
      <div className="divider">OR</div>
      <button
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default SocialLogin;