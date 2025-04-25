import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 