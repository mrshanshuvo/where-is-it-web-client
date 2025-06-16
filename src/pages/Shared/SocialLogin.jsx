import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import { useNavigate } from 'react-router';

const SocialLogin = ({ from }) => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result);
        navigate(from || '/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleSignIn}
        className="btn w-full bg-white text-black border border-[#e5e5e5] hover:shadow-md"
      >
        <svg
          aria-label="Google logo"
          width="20"
          height="20"
          viewBox="0 0 512 512"
          className="mr-2"
        >
          <path fill="#fff" d="M0 0h512v512H0z" />
          <path fill="#EA4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
          <path fill="#FBBC05" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#34A853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285F4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
