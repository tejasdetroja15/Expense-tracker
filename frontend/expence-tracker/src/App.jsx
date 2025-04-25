import React from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'
import GoogleCallback from './pages/Auth/GoogleCallback'
import ProtectedRoute from './components/ProtectedRoute'
import UserProvider from './context/UserContext'
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider> 
    <UserProvider>  
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/income" element={
              <ProtectedRoute>
                <Income />
              </ProtectedRoute>
            } />
            <Route path="/expense" element={
              <ProtectedRoute>
                <Expense />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </div>
 
      <Toaster
        toastOptions={{
          className: '',
          style:{
            fontSize : '13px'
          },
        }}
        />
    </UserProvider>
  </ThemeProvider>
  )
}

export default App;
