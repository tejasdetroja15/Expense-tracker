import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from "../../components/Input/input";
import { API_PATHS } from '../../../utils/apipath';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../../src/context/UserContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { updateUser } = useContext(UserContext);

  const email = location.state?.email;

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, {
        email,
        otp
      });

      // Check if we have a token in the response, which indicates successful verification
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        updateUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        toast.success('Email verified successfully');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      toast.success('Verification code sent to your email');
      startResendCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate('/signup');
    return null;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mt-2">
              We've sent a verification code to {email}
            </p>
          </div>
          
          <form onSubmit={handleVerifyOTP} className="space-y-6">
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className="font-medium text-[#9810FA] hover:text-[#8609e0] transition duration-300 disabled:opacity-50"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail; 