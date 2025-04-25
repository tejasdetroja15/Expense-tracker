const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, 
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Expense Tracker',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9810FA;">Verify Your Email</h2>
        <p>Thank you for signing up for Expense Tracker. Please use the following code to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>Expense Tracker Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP - Expense Tracker',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9810FA;">Reset Your Password</h2>
        <p>You requested to reset your password for your Expense Tracker account. Please use the following code to verify your identity:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Best regards,<br>Expense Tracker Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
}; 