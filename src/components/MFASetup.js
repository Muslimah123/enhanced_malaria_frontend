// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { enableMFA, verifyMFA } from '../services/api';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Smartphone, Check, AlertCircle, Copy } from 'lucide-react';
// import { QRCodeSVG } from 'qrcode.react';

// const MFASetup = () => {
//   const [qrCodeUri, setQrCodeUri] = useState('');
//   const [secret, setSecret] = useState('');
//   const [backupCodes, setBackupCodes] = useState([]);
//   const [token, setToken] = useState('');
//   const [error, setError] = useState('');
//   const [step, setStep] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     handleEnableMFA();
//   }, []);

//   const handleEnableMFA = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Token is missing, unable to enable MFA');
//         return;
//       }
//       const response = await enableMFA();
//       setQrCodeUri(response.qr_code);
//       setSecret(response.secret);
//       setBackupCodes(response.backup_codes);
//       setStep(1);
//     } catch (error) {
//       console.error('Error enabling MFA:', error);
//       setError('Failed to enable MFA. Please try again.');
//     }
//   };

//   const handleVerifyMFA = async () => {
//     try {
//       await verifyMFA(token);
//       setStep(2);
//       setTimeout(() => navigate('/login'), 3000);
//     } catch (error) {
//       setError('Invalid MFA token. Please try again.');
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       alert('Copied to clipboard!');
//     }, (err) => {
//       console.error('Could not copy text: ', err);
//     });
//   };

//   const steps = [
//     { title: 'Generate QR Code', icon: <Shield size={24} /> },
//     { title: 'Scan QR Code', icon: <Smartphone size={24} /> },
//     { title: 'Verify MFA Token', icon: <Check size={24} /> },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
//       >
//         <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Set up Multi-Factor Authentication</h2>
        
//         <div className="flex justify-between mb-8">
//           {steps.map((s, index) => (
//             <div key={index} className={`flex flex-col items-center ${step >= index ? 'text-blue-500' : 'text-gray-400'}`}>
//               <div className={`rounded-full p-2 ${step >= index ? 'bg-blue-100' : 'bg-gray-100'}`}>
//                 {s.icon}
//               </div>
//               <span className="text-xs mt-1">{s.title}</span>
//             </div>
//           ))}
//         </div>

//         {step === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <p className="mb-4">Generating your MFA QR code...</p>
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           </motion.div>
//         )}

//         {step === 1 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <div className="mb-6 flex justify-center">
//               <QRCodeSVG value={qrCodeUri} size={200} />
//             </div>
//             <p className="mb-4 text-center text-sm text-gray-600">
//               Scan this QR code with your authenticator app
//             </p>
//             <div className="mb-6 text-center text-xs text-gray-500 relative">
//               <span>Secret: {secret}</span>
//               <button 
//                 onClick={() => copyToClipboard(secret)}
//                 className="absolute right-0 top-0 text-blue-500 hover:text-blue-600"
//               >
//                 <Copy size={16} />
//               </button>
//             </div>
//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Backup Codes:</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 {backupCodes.map((code, index) => (
//                   <div key={index} className="text-xs bg-gray-100 p-2 rounded">
//                     {code}
//                   </div>
//                 ))}
//               </div>
//               <p className="text-xs text-gray-500 mt-2">
//                 Store these backup codes securely. You can use them if you lose access to your authenticator app.
//               </p>
//             </div>
//             <input
//               type="text"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//               placeholder="Enter MFA token"
//               className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             />
//             <button
//               onClick={handleVerifyMFA}
//               className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
//             >
//               Verify MFA
//             </button>
//           </motion.div>
//         )}

//         {step === 2 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center"
//           >
//             <div className="mb-4 flex justify-center">
//               <Check size={48} className="text-green-500" />
//             </div>
//             <p className="mb-4 text-lg font-semibold text-gray-800">MFA Setup Successful!</p>
//             <p className="text-sm text-gray-600">Redirecting to login page...</p>
//           </motion.div>
//         )}

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
//           >
//             <AlertCircle size={20} className="mr-2" />
//             <p className="text-sm">{error}</p>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default MFASetup;
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Check, AlertCircle, Copy, LogIn } from 'lucide-react';
import { enableMFA, verifyMFA } from '../services/api';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  mfaToken: Yup.string()
    .required('MFA token is required')
    .matches(/^\d{6}$/, 'MFA token must be 6 digits')
});

const MFASetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    handleEnableMFA();
  }, []);

  const handleEnableMFA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token is missing. Please try registering again.');
        return;
      }
      const response = await enableMFA();
      setQrCode(response.qr_code);
      setSecret(response.secret);
      setStep(1);
    } catch (error) {
      console.error('Error enabling MFA:', error);
      setError('Failed to enable MFA. Please try again.');
    }
  };
  

  const handleVerifyMFA = async (values, { setSubmitting }) => {
    try {
      await verifyMFA(values.mfaToken);
      setStep(2);
    } catch (error) {
      setError('Invalid MFA token. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const steps = [
    { title: 'Generate QR Code', icon: <Shield size={24} /> },
    { title: 'Scan QR Code', icon: <Smartphone size={24} /> },
    { title: 'Verify MFA Token', icon: <Check size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Set up Multi-Factor Authentication</h2>
        
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => (
            <div key={index} className={`flex flex-col items-center ${step >= index ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${step >= index ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {s.icon}
              </div>
              <span className="text-xs mt-1">{s.title}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="mb-4">Generating your MFA QR code...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-6 flex justify-center">
              {qrCode ? (
                <img src={qrCode} alt="MFA QR Code" className="rounded-lg shadow-md" />
              ) : (
                <p className="text-red-500">QR code failed to load. Please try refreshing the page.</p>
              )}
            </div>
            <p className="mb-4 text-center text-sm text-gray-600">
              Scan this QR code with your authenticator app
            </p>
            <div className="mb-6 text-center text-xs text-gray-500 relative">
              <span>Secret: {secret}</span>
              <button 
                onClick={() => copyToClipboard(secret)}
                className="absolute right-0 top-0 text-blue-500 hover:text-blue-600"
              >
                <Copy size={16} />
              </button>
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
                    Verify MFA
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <Check size={48} className="text-green-500" />
            </div>
            <p className="mb-4 text-lg font-semibold text-gray-800">MFA Setup Successful!</p>
            <p className="text-sm text-gray-600 mb-6">Your account is now secured with Multi-Factor Authentication.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center justify-center w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
            >
              <LogIn size={20} className="mr-2" />
              Proceed to Login
            </motion.button>
          </motion.div>
        )}

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

export default MFASetup;