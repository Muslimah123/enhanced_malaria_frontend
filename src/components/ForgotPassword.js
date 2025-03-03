import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { resetPassword } from '../services/api';
import * as Yup from 'yup';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = () => {
  const [resetSent, setResetSent] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await resetPassword(values.email);
      setResetSent(true);
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
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Forgot Password</h2>
        {resetSent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
          >
            Password reset email sent. Please check your inbox.
          </motion.div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                  <Field
                    name="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                  )}
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
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

