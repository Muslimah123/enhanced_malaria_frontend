// File: src/components/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { confirmPasswordReset } from '../services/api';
import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Required'),
  mfaToken: Yup.string(),
  backupCode: Yup.string(),
});

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    // Extract token from query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
    } else {
      navigate('/login');  // Redirect if token is not present
    }
  }, [location, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await confirmPasswordReset(resetToken, values.newPassword, values.mfaToken, values.backupCode);
      setResetSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
      >
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Reset Your Password</h2>
        {resetSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
          >
            Password reset successful. Redirecting to login...
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
              <Form className="space-y-6">
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={values.showPassword ? 'text' : 'password'}
                    className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setFieldValue('showPassword', !values.showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.newPassword && touched.newPassword && (
                    <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
                  )}
                </div>

                <div className="relative">
                  <Field
                    name="confirmNewPassword"
                    type={values.showPassword ? 'text' : 'password'}
                    className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Confirm New Password"
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <div className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</div>
                  )}
                </div>

                <div className="relative">
                  <Field
                    name="mfaToken"
                    type="text"
                    className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="MFA Token (if enabled)"
                  />
                </div>

                <div className="relative">
                  <Field
                    name="backupCode"
                    type="text"
                    className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Backup Code (if MFA enabled)"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </motion.button>
              </Form>
            )}
          </Formik>
        )}

        {apiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
          >
            {apiError}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
