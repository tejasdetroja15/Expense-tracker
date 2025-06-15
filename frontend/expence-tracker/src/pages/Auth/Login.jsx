import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from "../../components/Input/input";
import { validateEmail } from "../../../utils/helper";
import { Link } from 'react-router-dom';
import { API_PATHS } from '../../../utils/apipath';
import axiosInstance from '../../../utils/axiosInstance';
import { UserContext } from '../../../src/context/UserContext';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendingOTP, setResendingOTP] = useState(false);

  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setUnverifiedEmail(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      console.log("Login response", response.data);

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error details:", err.response || err.message || err);
      
      // Check if the error is due to unverified email
      if (err.response?.status === 403 && err.response?.data?.requireVerification) {
        setUnverifiedEmail(err.response.data.email);
        setError("Email not verified");
      } else {
        setError(err.response?.data?.message || "An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!unverifiedEmail) return;
    
    setResendingOTP(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email: unverifiedEmail });
      toast.success("Verification code sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setResendingOTP(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // Redirect to Google OAuth
      window.location.href = `${API_PATHS.AUTH.GOOGLE_LOGIN}`;
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to login with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please enter your details to log in
            </p>
          </div>
          
          {location.state?.message && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              <p className="text-red-600 text-sm">{location.state.message}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
              />
            </div>

            <div>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#9810FA] hover:text-[#8609e0] transition duration-300"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
                {unverifiedEmail && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      Your email is not verified. Please check your inbox for the verification code.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendingOTP}
                      className="text-sm text-[#9810FA] hover:text-[#8609e0] transition duration-300 underline"
                    >
                      {resendingOTP ? "Sending..." : "Resend verification code"}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#9810FA] hover:bg-[#8609e0] text-white font-medium py-3 px-4 rounded-md uppercase transition duration-300 ease-in-out 
                        hover:shadow-lg hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

         <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out 
                      hover:bg-gray-100 hover:shadow-md hover:scale-[1.02] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link className="font-medium text-[#9810FA] hover:text-[#8609e0] transition duration-300" to="/signup">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;