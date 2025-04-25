import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from "../../components/Input/input";
import { API_PATHS } from '../../../utils/apipath';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = location.state?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        resetToken: token,
        newPassword: password,
        confirmPassword: confirmPassword
      });
      
      // Show success toast notification
      toast.success('Password has been reset successfully. Please login with your new password.');
      
      // Navigate to login page without state
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please enter your new password
            </p>
          </div>
           
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="New Password"
                placeholder="Enter your new password"
                type="password"
              />
            </div>

            <div>
              <Input
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type="password"
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword; 