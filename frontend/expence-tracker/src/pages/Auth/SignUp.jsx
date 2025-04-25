import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from "../../components/Input/input";
import { validateEmail } from "../../../utils/helper";
import { Link } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/Input/ProfilePhotoSelector';
import { API_PATHS } from '../../../utils/apipath';
import axiosInstance from '../../../utils/axiosInstance';
import { UserContext } from '../../../src/context/UserContext';
import uploadImage from '../../../utils/uploadImage';

const SignUp = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Full name is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Upload the profile picture if it exists
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        console.log("Image upload response:", imgUploadRes);
        profileImageUrl = imgUploadRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });
      console.log("Sign up response", response.data);

      // Navigate to email verification page
      navigate('/verify-email', { 
        state: { email }
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "An error occurred. Please try again later.");
      } else {
        console.error("Sign up error details:", err.response || err.message || err);
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Create an Account</h3>
            <p className="text-sm text-gray-600 mt-2">
              Join us today by entering your details below.
            </p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="flex justify-center mb-6">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
                buttonClassName="bg-[#9810FA] hover:bg-[#8609E0] text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 lg:col-span-1">
                <Input
                  value={fullName}
                  onChange={({ target }) => setFullName(target.value)}
                  label="Full Name"
                  placeholder="John Doe"
                  type="text"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-1">
                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
            </div>
          
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#9810FA] hover:bg-[#8609e0] text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out uppercase disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link className="font-medium text-[#9810FA] hover:text-[#8609e0] transition duration-300" to="/login">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;