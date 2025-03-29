// // File: src/components/ResetPassword.js
// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import { confirmPasswordReset } from '../services/api';
// import * as Yup from 'yup';

// const ResetPasswordSchema = Yup.object().shape({
//   newPassword: Yup.string()
//     .min(8, 'Password must be at least 8 characters')
//     .required('Required'),
//   confirmNewPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
//     .required('Required'),
//   mfaToken: Yup.string(),
//   backupCode: Yup.string(),
// });

// const ResetPassword = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [apiError, setApiError] = useState('');
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetToken, setResetToken] = useState('');

//   useEffect(() => {
//     // Extract token from query parameters
//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');
//     if (token) {
//       setResetToken(token);
//     } else {
//       navigate('/login');  // Redirect if token is not present
//     }
//   }, [location, navigate]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       await confirmPasswordReset(resetToken, values.newPassword, values.mfaToken, values.backupCode);
//       setResetSuccess(true);
//       setTimeout(() => navigate('/login'), 3000);
//     } catch (error) {
//       setApiError(error.response?.data?.message || 'An error occurred. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
//       >
//         <h2 className="text-3xl font-bold text-blue-600 mb-6">Reset Your Password</h2>
//         {resetSuccess ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//           >
//             Password reset successful. Redirecting to login...
//           </motion.div>
//         ) : (
//           <Formik
//             initialValues={{
//               newPassword: '',
//               confirmNewPassword: '',
//               mfaToken: '',
//               backupCode: '',
//               showPassword: false,
//             }}
//             validationSchema={ResetPasswordSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//               <Form className="space-y-6">
//                 <div className="relative">
//                   <Field
//                     name="newPassword"
//                     type={values.showPassword ? 'text' : 'password'}
//                     className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="New Password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                   >
//                     {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                   {errors.newPassword && touched.newPassword && (
//                     <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <Field
//                     name="confirmNewPassword"
//                     type={values.showPassword ? 'text' : 'password'}
//                     className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="Confirm New Password"
//                   />
//                   {errors.confirmNewPassword && touched.confirmNewPassword && (
//                     <div className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</div>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <Field
//                     name="mfaToken"
//                     type="text"
//                     className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="MFA Token (if enabled)"
//                   />
//                 </div>

//                 <div className="relative">
//                   <Field
//                     name="backupCode"
//                     type="text"
//                     className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="Backup Code (if MFA enabled)"
//                   />
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                     isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'
//                   }`}
//                 >
//                   {isSubmitting ? 'Resetting...' : 'Reset Password'}
//                 </motion.button>
//               </Form>
//             )}
//           </Formik>
//         )}

//         {apiError && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//           >
//             {apiError}
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default ResetPassword;
// File: src/components/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, CheckCircle, AlertCircle, 
  Shield, Key, ArrowLeft, Loader
} from 'lucide-react';
import { confirmPasswordReset } from '../services/api';
import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .required('Required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Required'),
  mfaToken: Yup.string(),
  backupCode: Yup.string(),
});

const PasswordStrength = ({ password }) => {
  // Calculate password strength
  const getStrength = (pass) => {
    if (!pass) return 0;
    
    let strength = 0;
    // Length contribution (up to 25%)
    strength += Math.min(pass.length / 16, 1) * 25;
    
    // Character variety contribution (up to 75%)
    if (/[a-z]/.test(pass)) strength += 15;  // lowercase
    if (/[A-Z]/.test(pass)) strength += 15;  // uppercase
    if (/[0-9]/.test(pass)) strength += 15;  // digits
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 15;  // special chars
    if (/(.)\1\1/.test(pass)) strength -= 10;  // repeated characters penalty
    
    // Length bonus for longer passwords
    if (pass.length > 10) strength += 15;
    
    return Math.min(Math.max(strength, 0), 100);
  };
  
  const strength = getStrength(password);
  
  const getColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getLabel = () => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Password Strength</span>
        <span className={`text-xs font-medium ${strength < 30 ? 'text-red-500' : strength < 60 ? 'text-yellow-500' : strength < 80 ? 'text-blue-500' : 'text-green-500'}`}>
          {getLabel()}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-300 ease-out`} 
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(3);

  useEffect(() => {
    // Extract token from query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setLoading(false);
    } else {
      setTokenError(true);
      setLoading(false);
      // Don't immediately redirect, show error first
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (resetSuccess && redirectSeconds > 0) {
      timer = setTimeout(() => {
        setRedirectSeconds(prev => prev - 1);
      }, 1000);
    } else if (resetSuccess && redirectSeconds === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [resetSuccess, redirectSeconds, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await confirmPasswordReset(resetToken, values.newPassword, values.mfaToken, values.backupCode);
      setResetSuccess(true);
      setApiError('');
    } catch (error) {
      setApiError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 flex flex-col items-center justify-center">
          <Loader className="text-blue-600 animate-spin mb-4" size={32} />
          <p className="text-gray-600">Verifying your reset token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
      >
        <button 
          onClick={handleBackToLogin}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span className="text-sm">Back to Login</span>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
          <p className="text-gray-500 mt-1">Create a strong, secure password for your account</p>
        </div>

        {tokenError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-200 rounded-xl p-4 flex items-start"
          >
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-medium text-red-800">Invalid or Missing Token</h3>
              <p className="text-red-700 text-sm mt-1">
                Your password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <button
                onClick={handleBackToLogin}
                className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Return to Login
              </button>
            </div>
          </motion.div>
        ) : resetSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">Password Reset Successful</h3>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <div className="w-16 h-16 relative mb-3">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle 
                  cx="18" cy="18" r="16" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeDasharray="100" 
                  strokeDashoffset={100 - (redirectSeconds / 3) * 100}
                  transform="rotate(-90 18 18)" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                {redirectSeconds}
              </div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login in {redirectSeconds} seconds</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Login Now
            </button>
          </motion.div>
        ) : (
          <Formik
            initialValues={{
              newPassword: '',
              confirmNewPassword: '',
              mfaToken: '',
              backupCode: '',
              showPassword: false,
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-5">
                <div>
                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                      <Lock className="text-blue-600 opacity-70" size={18} />
                    </div>
                    <Field
                      name="newPassword"
                      type={values.showPassword ? 'text' : 'password'}
                      className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white text-gray-800
                        border ${errors.newPassword && touched.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      placeholder="New Password"
                    />
                    <button
                      type="button"
                      onClick={() => setFieldValue('showPassword', !values.showPassword)}
                      className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                      {values.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.newPassword && <PasswordStrength password={values.newPassword} />}
                  {errors.newPassword && touched.newPassword && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center mt-1 text-red-500"
                    >
                      <AlertCircle size={14} className="mr-1.5" />
                      <span className="text-xs">{errors.newPassword}</span>
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                    <Lock className="text-blue-600 opacity-70" size={18} />
                  </div>
                  <Field
                    name="confirmNewPassword"
                    type={values.showPassword ? 'text' : 'password'}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800
                      border ${errors.confirmNewPassword && touched.confirmNewPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Confirm New Password"
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center mt-1 text-red-500"
                    >
                      <AlertCircle size={14} className="mr-1.5" />
                      <span className="text-xs">{errors.confirmNewPassword}</span>
                    </motion.div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-5 pb-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Multi-Factor Authentication</h3>
                  <p className="text-xs text-gray-500 mb-4">If you have MFA enabled, please provide either your MFA token or backup code</p>
                  
                  <div className="relative mb-4">
                    <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                      <Shield className="text-blue-600 opacity-70" size={18} />
                    </div>
                    <Field
                      name="mfaToken"
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="MFA Token (if enabled)"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                      <Key className="text-blue-600 opacity-70" size={18} />
                    </div>
                    <Field
                      name="backupCode"
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Backup Code (if MFA enabled)"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start p-3.5 rounded-lg border bg-red-50 border-red-200 text-red-700"
                    >
                      <AlertCircle size={16} className="flex-shrink-0 mr-2" />
                      <div className="flex-1 text-sm">{apiError}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium 
                    py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 
                    ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;