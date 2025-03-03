import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RegistrationSuccess = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full p-8 text-center"
      >
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Registration Successful!')}</h2>
        <p className="text-gray-600 mb-4">
          {t('We\'ve sent a verification email to your inbox. Please verify your email to complete the registration process.')}
        </p>
        <p className="text-gray-600">
          {t('After verifying your email, you will be prompted to set up Multi-Factor Authentication (MFA).')}
        </p>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccess;