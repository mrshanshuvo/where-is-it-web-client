import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import SocialLogin from "../Shared/SocialLogin";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signInUser(email, password);
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className="max-w-md mx-auto border p-7 rounded">
      <h2 className="text-3xl text-center font-semibold mb-6">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-center">
        New to the site?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Create an account
        </Link>
      </p>

      <SocialLogin from={from}></SocialLogin>
    </div>
  );
};

export default SignIn;
