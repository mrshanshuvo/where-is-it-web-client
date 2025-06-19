import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

const SocialLogin = ({ from }) => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate(from || "/", { replace: true });
    } catch (error) {
      toast.error(`Failed to sign in with Google: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="btn btn-outline w-full flex items-center justify-center gap-2"
    >
      <FaGoogle className="text-lg" />
      Sign in with Google
    </button>
  );
};

export default SocialLogin;
