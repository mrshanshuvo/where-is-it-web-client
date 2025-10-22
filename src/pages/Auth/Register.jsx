import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import registerLottie from "../../assets/lotties/register.json";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    return errors.length ? errors.join(". ") : null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      setLoading(false);
      return;
    }
    setPasswordError("");

    try {
      const { user } = await createUser(email, password);
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL || null,
      });

      // Get Firebase ID token and send to backend to get JWT cookie
      const idToken = await user.getIdToken();
      await axios.post(
        "http://localhost:5000/api/users/firebase-login",
        { idToken },
        { withCredentials: true }
      );

      toast.success("Registration successful! Welcome to WhereIsIt");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10 w-full max-w-6xl p-4">
        {/* Animation Section */}
        <div className="w-full max-w-md hidden md:block">
          <Lottie animationData={registerLottie} loop={true} />
        </div>

        {/* Registration Form */}
        <div className="card flex-shrink-0 w-full max-w-md shadow-xl bg-white">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Create Account
            </h1>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Photo URL Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Profile Photo URL
                  </span>
                </label>
                <input
                  type="url"
                  name="photoURL"
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  autoComplete="photo"
                />
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                    autoComplete="new-password"
                    onChange={() => setPasswordError("")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
                <ul className="mt-1 text-xs text-gray-500">
                  <li>• Must be at least 6 characters</li>
                  <li>• Must contain uppercase letter</li>
                  <li>• Must contain lowercase letter</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
              </span>
              <Link
                to="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
