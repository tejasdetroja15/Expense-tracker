import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const handleCallback = () => {
      try {
        console.log('Starting Google callback handling...');
        
        // Get the token and user data from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');

        console.log('URL Parameters:', {
          token: token ? 'exists' : 'missing',
          userData: userData ? 'exists' : 'missing'
        });

        if (!token || !userData) {
          console.error('Missing data:', { token: !!token, userData: !!userData });
          throw new Error('Missing authentication data');
        }

        // Parse the user data
        const user = JSON.parse(decodeURIComponent(userData));
        console.log('Parsed user data:', { 
          id: user._id,
          email: user.email,
          name: user.fullName 
        });
        
        // Store the token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update user context
        updateUser(user);
        
        // Show success message
        toast.success('Successfully logged in with Google!');
        
        // Redirect to dashboard immediately
        console.log('Redirecting to dashboard...');
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Google callback error details:', {
          message: error.message,
          stack: error.stack,
          urlParams: window.location.search
        });

        let errorMessage = 'Failed to login with Google. Please try again.';
        
        if (error.message === 'Missing authentication data') {
          errorMessage = 'Unable to complete Google login. Please try again.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'There was a problem processing your login information. Please try again.';
        }

        toast.error(errorMessage);
        navigate('/login', { 
          state: { 
            message: errorMessage
          },
          replace: true
        });
      }
    };

    handleCallback();
  }, [navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Completing Google Login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9810FA] mx-auto"></div>
        <p className="mt-4 text-gray-600">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 