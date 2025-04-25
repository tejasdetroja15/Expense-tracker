import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from "../../components/Input/input";
import { validateEmail } from "../../../utils/helper";
import { Link } from 'react-router-dom';
import { API_PATHS } from '../../../utils/apipath';
import axiosInstance from '../../../utils/axiosInstance';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setShowOtpInput(true);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_RESET_OTP, { 
        email,
        otp 
      });
      
      // Navigate to reset password page with the reset token
      navigate('/reset-password', { 
        state: { 
          token: response.data.resetToken,
          email 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Forgot Password</h3>
            <p className="text-sm text-gray-600 mt-2">
              {showOtpInput 
                ? "Enter the verification code sent to your email"
                : "Enter your email address and we'll send you a verification code."}
            </p>
          </div>
          
          {showOtpInput ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <Input
                  value={otp}
                  onChange={({ target }) => setOtp(target.value)}
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  type="text"
                  maxLength={6}
                />
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
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="font-medium text-[#9810FA] hover:text-[#8609e0] transition duration-300"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                />
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
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link className="font-medium text-[#9810FA] hover:text-[#8609e0] transition duration-300" to="/login">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 