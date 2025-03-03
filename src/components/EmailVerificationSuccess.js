import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const EmailVerificationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored successfully:', token);
    } else {
      console.error('No token found in URL');
    }

    const timer = setTimeout(() => {
      navigate('/mfa-setup');
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle size={64} className="text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Email Verified Successfully!</h2>
        <p className="text-gray-600 mb-6 text-center">
          You will be redirected to set up Multi-Factor Authentication in {countdown} seconds...
        </p>
        <motion.div
          className="w-full bg-gray-200 rounded-full h-2.5 mb-6"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 3, ease: 'linear' }}
        >
          <div className="bg-blue-600 h-2.5 rounded-full"></div>
        </motion.div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mfa-setup')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600 flex items-center"
          >
            Proceed to MFA Setup <ArrowRight className="ml-2" size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationSuccess;