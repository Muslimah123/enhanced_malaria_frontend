import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Check, AlertCircle } from 'lucide-react';
import { verifyMFA } from '../services/api';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  mfaToken: Yup.string()
    .required('MFA token is required')
    .matches(/^\d{6}$/, 'MFA token must be 6 digits')
});

const MFAVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const handleVerifyMFA = async (values, { setSubmitting }) => {
    try {
      const response = await verifyMFA(values.mfaToken);
      if (response.message === 'MFA verified successfully') {
        localStorage.setItem('token', response.access_token);
        navigate('/dashboard');
      } else {
        setError('MFA verification failed. Please try again.');
      }
    } catch (error) {
      setError('Invalid MFA token. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Verify MFA</h2>
        
        <div className="flex justify-center mb-8">
          <div className="rounded-full p-4 bg-blue-100">
            <Shield size={48} className="text-blue-500" />
          </div>
        </div>

        <Formik
          initialValues={{ mfaToken: '' }}
          validationSchema={validationSchema}
          onSubmit={handleVerifyMFA}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="mfaToken"
                  type="text"
                  placeholder="Enter MFA token"
                  className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {errors.mfaToken && touched.mfaToken && (
                  <div className="text-red-500 text-sm mt-1">{errors.mfaToken}</div>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
              >
                {isSubmitting ? 'Verifying...' : 'Verify MFA'}
              </button>
            </Form>
          )}
        </Formik>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
          >
            <AlertCircle size={20} className="mr-2" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MFAVerify;