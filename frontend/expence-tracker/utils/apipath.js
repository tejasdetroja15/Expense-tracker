export const BASE_URL = process.env.REACT_APP_API_URL;

// export const BASE_URL = 'http://localhost:8000';

// utils/apiPaths.js 
export const API_PATHS = {
    AUTH: {
      LOGIN: `${BASE_URL}/api/v1/auth/login`,
      REGISTER: `${BASE_URL}/api/v1/auth/register`,
      GET_USER_INFO: `${BASE_URL}/api/v1/auth/getUser`,
      VERIFY_EMAIL: `${BASE_URL}/api/v1/auth/verify-email`,
      RESEND_OTP: `${BASE_URL}/api/v1/auth/resend-otp`,
      FORGOT_PASSWORD: `${BASE_URL}/api/v1/auth/forgot-password`,
      VERIFY_RESET_OTP: `${BASE_URL}/api/v1/auth/verify-reset-otp`,
      RESET_PASSWORD: `${BASE_URL}/api/v1/auth/reset-password`,
      GOOGLE_LOGIN: `${BASE_URL}/api/v1/auth/google`,
    },
  
    DASHBOARD: {
      GET_DATA: `${BASE_URL}/api/v1/dashboard`,
    },
  
    INCOME: {
      ADD_INCOME: `${BASE_URL}/api/v1/income/add`,
      GET_ALL_INCOME: `${BASE_URL}/api/v1/income/get`,
      DELETE_INCOME: (incomeId) => `${BASE_URL}/api/v1/income/${incomeId}`,
      UPDATE_INCOME: (incomeId) => `${BASE_URL}/api/v1/income/${incomeId}`,
      DOWNLOAD_INCOME: `${BASE_URL}/api/v1/income/downloadexcel`,
    },
  
    EXPENSE: {
      ADD_EXPENSE: `${BASE_URL}/api/v1/expense/add`,
      GET_ALL_EXPENSE: `${BASE_URL}/api/v1/expense/get`,
      DELETE_EXPENSE: (expenseId) => `${BASE_URL}/api/v1/expense/${expenseId}`,
      UPDATE_EXPENSE: (expenseId) => `${BASE_URL}/api/v1/expense/${expenseId}`,
      DOWNLOAD_EXPENSE: `${BASE_URL}/api/v1/expense/downloadexcel`,
    },
  
    IMAGE: {
      UPLOAD_IMAGE: `${BASE_URL}/api/v1/auth/upload-image`,
    },
};

  