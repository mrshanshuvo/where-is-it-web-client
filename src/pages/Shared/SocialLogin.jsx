import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Track previous page or fallback to home
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(); // AuthProvider already updates user
      toast.success("Login successful!");
      navigate(from, { replace: true }); // redirect to original page
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="mt-6">
      <div className="divider">OR</div>
      <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
        Continue with Google
      </button>
    </div>
  );
};

export default SocialLogin;
