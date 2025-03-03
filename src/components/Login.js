// // export default Login;
// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Star as StarIcon } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// const Star = ({ className }) => (
//   <StarIcon className={className} />
// );

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const message = params.get('message');
//     const error = params.get('error');

//     if (message === 'email_confirmed') {
//       setConfirmationMessage('Your email has been confirmed. You can now log in.');
//     } else if (message === 'already_confirmed') {
//       setConfirmationMessage('Your email was already confirmed. Please log in.');
//     } else if (error === 'invalid_token') {
//       setConfirmationMessage('The confirmation link is invalid or has expired.');
//     }
//   }, [location]);

//   const initialValues = {
//     email: '',
//     password: '',
//     showPassword: false,
//     rememberMe: false,
//   };

//   const handleSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const response = await login(values.email, values.password);
//       const { user, access_token } = response.data;
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('Login successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResendVerification = async (email) => {
//     try {
//       await sendVerificationEmail(email);
//       setEmailSent(true);
//     } catch (error) {
//       console.error('Failed to resend verification email:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
//       >
//         <div className="w-full md:w-1/2 relative">
//           <img 
//             src={doctorImage}
//             alt="Doctor" 
//             className="object-cover w-full h-64 md:h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
//           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
//           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
//           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
//           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
//         </div>
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
//           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
//           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
//           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back !</h2>
//           <p className="text-blue-100 mb-8">Login Your Account</p>
          
//           {confirmationMessage && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{confirmationMessage}</span>
//             </motion.div>
//           )}

//           <Formik
//             initialValues={initialValues}
//             validationSchema={loginSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//               <Form className="space-y-6">
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                   <Field
//                     name="email"
//                     type="email"
//                     className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder={t('Email Address')}
//                   />
//                   {errors.email && touched.email && (
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-red-300 text-sm mt-1"
//                     >
//                       {errors.email}
//                     </motion.p>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                   <Field
//                     name="password"
//                     type={values.showPassword ? 'text' : 'password'}
//                     className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder={t('Password')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                   >
//                     {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                   {errors.password && touched.password && (
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="text-red-300 text-sm mt-1"
//                     >
//                       {errors.password}
//                     </motion.p>
//                   )}
//                 </div>

//                 <div className="flex justify-between items-center text-sm">
//                   <label className="flex items-center text-white">
//                     <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
//                     Remember Me
//                   </label>
//                   <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
//                     Forget Password?
//                   </Link>
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                     isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
//                   }`}
//                 >
//                   {isSubmitting ? t('Logging in...') : t('Login')}
//                 </motion.button>

//                 {apiError && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//                     role="alert"
//                   >
//                     <span className="block sm:inline">{apiError}</span>
//                     {apiError === 'Please confirm your email before logging in.' && (
//                       <button
//                         onClick={() => handleResendVerification(values.email)}
//                         className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
//                       >
//                         Resend verification email
//                       </button>
//                     )}
//                   </motion.div>
//                 )}

//                 {emailSent && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
//                     role="alert"
//                   >
//                     <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
//                   </motion.div>
//                 )}
//               </Form>
//             )}
//           </Formik>

//           <p className="text-center text-white mt-6 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
//               Register
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Star as StarIcon } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail, verifyMFA, enableMFA, disableMFA, resetPassword, confirmPasswordReset } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// const Star = ({ className }) => (
//   <StarIcon className={className} />
// );

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');
//   const [showMFAInput, setShowMFAInput] = useState(false);
//   const [mfaToken, setMFAToken] = useState('');
//   const [showMFASetup, setShowMFASetup] = useState(false);
//   const [mfaSetupData, setMFASetupData] = useState(null);
//   const [showPasswordReset, setShowPasswordReset] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetToken, setResetToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [resetMfaToken, setResetMfaToken] = useState('');
//   const [resetBackupCode, setResetBackupCode] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const message = params.get('message');
//     const error = params.get('error');

//     if (message === 'email_confirmed') {
//       setConfirmationMessage('Your email has been confirmed. You can now log in.');
//     } else if (message === 'already_confirmed') {
//       setConfirmationMessage('Your email was already confirmed. Please log in.');
//     } else if (error === 'invalid_token') {
//       setConfirmationMessage('The confirmation link is invalid or has expired.');
//     }
//   }, [location]);

//   const initialValues = {
//     email: '',
//     password: '',
//     showPassword: false,
//     rememberMe: false,
//   };

//   const handleSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const response = await login(values.email, values.password);
//       const { user, access_token, require_mfa } = response.data;
      
//       if (require_mfa) {
//         setShowMFAInput(true);
//         setApiError('Please enter your MFA code');
//         return;
//       }
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('Login successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleMFASubmit = async () => {
//     try {
//       const response = await verifyMFA(mfaToken);
//       const { user, access_token } = response.data;
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('MFA verification successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       setApiError('Invalid MFA token. Please try again.');
//     }
//   };

//   const handleResendVerification = async (email) => {
//     try {
//       await sendVerificationEmail(email);
//       setEmailSent(true);
//     } catch (error) {
//       console.error('Failed to resend verification email:', error);
//     }
//   };

//   const handleMFASetup = async () => {
//     try {
//       const response = await enableMFA();
//       setMFASetupData(response.data);
//       setShowMFASetup(true);
//     } catch (error) {
//       setApiError('Failed to set up MFA. Please try again.');
//     }
//   };

//   const handleMFADisable = async () => {
//     try {
//       await disableMFA();
//       setApiError('MFA has been disabled for your account.');
//     } catch (error) {
//       setApiError('Failed to disable MFA. Please try again.');
//     }
//   };

//   const handlePasswordReset = async () => {
//     try {
//       await resetPassword(resetEmail);
//       setApiError('Password reset email has been sent. Please check your inbox for the reset token.');
//       setShowPasswordReset('confirm');
//     } catch (error) {
//       setApiError('Failed to send password reset email. Please try again.');
//     }
//   };

//   const handleConfirmPasswordReset = async () => {
//     if (newPassword !== confirmNewPassword) {
//       setApiError('Passwords do not match. Please try again.');
//       return;
//     }

//     try {
//       await confirmPasswordReset(resetToken, newPassword, resetMfaToken, resetBackupCode);
//       setApiError('Password has been reset successfully. You can now log in with your new password.');
//       setShowPasswordReset(false);
//     } catch (error) {
//       setApiError('Failed to reset password. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
//       >
//         <div className="w-full md:w-1/2 relative">
//           <img 
//             src={doctorImage}
//             alt="Doctor" 
//             className="object-cover w-full h-64 md:h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
//           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
//           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
//           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
//           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
//         </div>
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
//           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
//           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
//           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
//           <p className="text-blue-100 mb-8">Login to Your Account</p>
          
//           {confirmationMessage && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{confirmationMessage}</span>
//             </motion.div>
//           )}

//           {!showMFAInput && !showMFASetup && !showPasswordReset ? (
//             <Formik
//               initialValues={initialValues}
//               validationSchema={loginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="email"
//                       type="email"
//                       className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Email Address')}
//                     />
//                     {errors.email && touched.email && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.email}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="password"
//                       type={values.showPassword ? 'text' : 'password'}
//                       className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Password')}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                     >
//                       {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                     {errors.password && touched.password && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <label className="flex items-center text-white">
//                       <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
//                       Remember Me
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswordReset('request')}
//                       className="text-white hover:underline transition-all duration-200"
//                     >
//                       Forgot Password?
//                     </button>
//                   </div>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                       isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
//                     }`}
//                   >
//                     {isSubmitting ? t('Logging in...') : t('Login')}
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           ) : showMFAInput ? (
//             <div className="space-y-6">
//               <div className="relative">
//                 <Field
//                   name="mfaToken"
//                   type="text"
//                   value={mfaToken}
//                   onChange={(e) => setMFAToken(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Enter MFA Token"
//                 />
//               </div>
//               <motion.button
//                 onClick={handleMFASubmit}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//               >
//                 Verify MFA
//               </motion.button>
//             </div>
//           ) : showMFASetup ? (
//             <div className="space-y-6">
//               <p className="text-white">Scan the QR code with your authenticator app:</p>
//               <img src={mfaSetupData.qr_code} alt="MFA QR Code" className="mx-auto" />
//               <p className="text-white">Or enter this code manually: {mfaSetupData.secret}</p>
//               <div className="relative">
//                 <Field
//                   name="mfaToken"
//                   type="text"
//                   value={mfaToken}
//                   onChange={(e) => setMFAToken(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Enter MFA Token to Verify"
//                 />
//               </div>
//               <motion.button
//                 onClick={handleMFASubmit}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//               >
//                 Verify and Enable MFA
//               </motion.button>
//             </div>
//           ) : showPasswordReset === 'request' ? (
//             <div className="space-y-6">
//               <div className="relative">
//                 <Field
//                   name="resetEmail"
//                   type="email"
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Enter your email"
//                 />
//               </div>
//               <motion.button
//                 onClick={handlePasswordReset}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//               >
//                 Send Reset Email
//               </motion.button>
//               <motion.button
//                 onClick={() => setShowPasswordReset(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-transparent text-white border border-white font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-lg mt-2"
//               >
//                 Back to Login
//               </motion.button>
//             </div>
//           ) : showPasswordReset === 'confirm' ? (
//             <div className="space-y-6">
//               <div className="relative">
//                 <Field
//                   name="resetToken"
//                   type="text"
//                   value={resetToken}
//                   onChange={(e) => setResetToken(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Enter reset token from email"
//                 />
//               </div>
//               <div className="relative">
//                 <Field
//                   name="newPassword"
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Enter new password"
//                 />
//               </div>
//               <div className="relative">
//                 <Field
//                   name="confirmNewPassword"
//                   type="password"
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                   placeholder="Confirm new password"
//                 />
//               </div>
//               {mfaSetupData && (
//                 <div className="relative">
//                   <Field
//                     name="resetMfaToken"
//                     type="text"
//                     value={resetMfaToken}
//                     onChange={(e) => setResetMfaToken(e.target.value)}
//                     className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                     placeholder="Enter MFA token (if enabled)"
//                   />
//                 </div>
//               )}
//               <motion.button
//                 onClick={handleConfirmPasswordReset}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//               >
//                 Reset Password
//               </motion.button>
//               <motion.button
//                 onClick={() => setShowPasswordReset(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full bg-transparent text-white border border-white font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-lg mt-2"
//               >
//                 Back to Login
//               </motion.button>
//             </div>
//           ) : null}

//           {apiError && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{apiError}</span>
//               {apiError === 'Please confirm your email before logging in.' && (
//                 <button
//                   onClick={() => handleResendVerification(resetEmail || initialValues.email)}
//                   className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
//                 >
//                   Resend verification email
//                 </button>
//               )}
//             </motion.div>
//           )}

//           {emailSent && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
//             </motion.div>
//           )}

//           <p className="text-center text-white mt-6 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
//               Register
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Star as StarIcon } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail, verifyMFA, enableMFA, disableMFA } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// const Star = ({ className }) => (
//   <StarIcon className={className} />
// );

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');
//   const [showMFAInput, setShowMFAInput] = useState(false);
//   const [mfaToken, setMFAToken] = useState('');
//   const [showMFASetup, setShowMFASetup] = useState(false);
//   const [mfaSetupData, setMFASetupData] = useState(null);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const message = params.get('message');
//     const error = params.get('error');

//     if (message === 'email_confirmed') {
//       setConfirmationMessage('Your email has been confirmed. You can now log in.');
//     } else if (message === 'already_confirmed') {
//       setConfirmationMessage('Your email was already confirmed. Please log in.');
//     } else if (error === 'invalid_token') {
//       setConfirmationMessage('The confirmation link is invalid or has expired.');
//     }
//   }, [location]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await login(values.email, values.password);
//       const { user, access_token, require_mfa } = response.data;
      
//       if (require_mfa) {
//         setShowMFAInput(true);
//         setApiError('Please enter your MFA code');
//         return;
//       }
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('Login successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleMFASubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await verifyMFA(values.mfaToken);
//       const { user, access_token } = response.data;
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('MFA verification successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       setApiError('Invalid MFA token. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResendVerification = async (email) => {
//     try {
//       await sendVerificationEmail(email);
//       setEmailSent(true);
//     } catch (error) {
//       console.error('Failed to resend verification email:', error);
//     }
//   };

//   const handleMFASetup = async () => {
//     try {
//       const response = await enableMFA();
//       setMFASetupData(response.data);
//       setShowMFASetup(true);
//     } catch (error) {
//       setApiError('Failed to set up MFA. Please try again.');
//     }
//   };

//   const handleMFADisable = async () => {
//     try {
//       await disableMFA();
//       setApiError('MFA has been disabled for your account.');
//     } catch (error) {
//       setApiError('Failed to disable MFA. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
//       >
//         <div className="w-full md:w-1/2 relative">
//           <img 
//             src={doctorImage}
//             alt="Doctor" 
//             className="object-cover w-full h-64 md:h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
//           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
//           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
//           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
//           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
//         </div>
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
//           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
//           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
//           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
//           <p className="text-blue-100 mb-8">Login to Your Account</p>
          
//           {confirmationMessage && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{confirmationMessage}</span>
//             </motion.div>
//           )}

//           {!showMFAInput && !showMFASetup && (
//             <Formik
//               initialValues={{ email: '', password: '', showPassword: false, rememberMe: false }}
//               validationSchema={loginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="email"
//                       type="email"
//                       className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Email Address')}
//                     />
//                     {errors.email && touched.email && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.email}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="password"
//                       type={values.showPassword ? 'text' : 'password'}
//                       className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Password')}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                     >
//                       {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                     {errors.password && touched.password && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <label className="flex items-center text-white">
//                       <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
//                       Remember Me
//                     </label>
//                     <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
//                       Forgot Password?
//                     </Link>
//                   </div>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                       isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
//                     }`}
//                   >
//                     {isSubmitting ? t('Logging in...') : t('Login')}
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           )}

//           {showMFAInput && (
//             <Formik
//               initialValues={{ mfaToken: '' }}
//               onSubmit={handleMFASubmit}
//             >
//               {({ isSubmitting }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Field
//                       name="mfaToken"
//                       type="text"
//                       className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder="Enter MFA Token"
//                     />
//                   </div>
//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//                   >
//                     Verify MFA
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           )}

//           {showMFASetup && (
//             <div className="space-y-6">
//               <p className="text-white">Scan the QR code with your authenticator app:</p>
//               <img src={mfaSetupData.qr_code} alt="MFA QR Code" className="mx-auto" />
//               <p className="text-white">Or enter this code manually: {mfaSetupData.secret}</p>
//               <Formik
//                 initialValues={{ mfaToken: '' }}
//                 onSubmit={handleMFASubmit}
//               >
//                 {({ isSubmitting }) => (
//                   <Form className="space-y-6">
//                     <div className="relative">
//                       <Field
//                         name="mfaToken"
//                         type="text"
//                         className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                         placeholder="Enter MFA Token to Verify"
//                       />
//                     </div>
//                     <motion.button
//                       type="submit"
//                       disabled={isSubmitting}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//                     >
//                       Verify and Enable MFA
//                     </motion.button>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           )}

//           {apiError && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{apiError}</span>
//               {apiError === 'Please confirm your email before logging in.' && (
//                 <button
//                   onClick={() => handleResendVerification(resetEmail || initialValues.email)}
//                   className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
//                 >
//                   Resend verification email
//                 </button>
//               )}
//             </motion.div>
//           )}

//           {emailSent && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
//             </motion.div>
//           )}

// <p className="text-center text-white mt-6 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
//               Register
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Star as StarIcon } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail, verifyMFA, enableMFA, disableMFA } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// const Star = ({ className }) => (
//   <StarIcon className={className} />
// );

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');
//   const [showMFAInput, setShowMFAInput] = useState(false);
//   const [showMFASetup, setShowMFASetup] = useState(false);
//   const [mfaSetupData, setMFASetupData] = useState(null);
//   const [currentEmail, setCurrentEmail] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const message = params.get('message');
//     const error = params.get('error');

//     if (message === 'email_confirmed') {
//       setConfirmationMessage('Your email has been confirmed. You can now log in.');
//     } else if (message === 'already_confirmed') {
//       setConfirmationMessage('Your email was already confirmed. Please log in.');
//     } else if (error === 'invalid_token') {
//       setConfirmationMessage('The confirmation link is invalid or has expired.');
//     }
//   }, [location]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await login(values.email, values.password);
//       const { user, access_token, require_mfa } = response.data;
      
//       setCurrentEmail(values.email);
      
//       if (require_mfa) {
//         setShowMFAInput(true);
//         setApiError('Please enter your MFA code');
//         return;
//       }
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('Login successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleMFASubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await verifyMFA(values.mfaToken);
//       const { user, access_token } = response.data;
      
//       dispatch({ type: 'LOGIN', payload: user });
//       console.log('MFA verification successful, navigating to dashboard');
//       localStorage.setItem('token', access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       setApiError('Invalid MFA token. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!currentEmail) {
//       setApiError('Please enter your email first.');
//       return;
//     }
//     try {
//       await sendVerificationEmail(currentEmail);
//       setEmailSent(true);
//       setApiError('');
//     } catch (error) {
//       console.error('Failed to resend verification email:', error);
//       setApiError('Failed to resend verification email. Please try again.');
//     }
//   };

//   const handleMFASetup = async () => {
//     try {
//       const response = await enableMFA();
//       setMFASetupData(response.data);
//       setShowMFASetup(true);
//     } catch (error) {
//       setApiError('Failed to set up MFA. Please try again.');
//     }
//   };

//   const handleMFADisable = async () => {
//     try {
//       await disableMFA();
//       setApiError('MFA has been disabled for your account.');
//     } catch (error) {
//       setApiError('Failed to disable MFA. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
//       >
//         {/* Left side with doctor image */}
//         <div className="w-full md:w-1/2 relative">
//           <img 
//             src={doctorImage}
//             alt="Doctor" 
//             className="object-cover w-full h-64 md:h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
//           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
//           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
//           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
//           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
//         </div>

//         {/* Right side with login form */}
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
//           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
//           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
//           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
//           <p className="text-blue-100 mb-8">Login to Your Account</p>
          
//           {confirmationMessage && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{confirmationMessage}</span>
//             </motion.div>
//           )}

//           {!showMFAInput && !showMFASetup && (
//             <Formik
//               initialValues={{ email: '', password: '', showPassword: false, rememberMe: false }}
//               validationSchema={loginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="email"
//                       type="email"
//                       className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Email Address')}
//                     />
//                     {errors.email && touched.email && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.email}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="password"
//                       type={values.showPassword ? 'text' : 'password'}
//                       className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Password')}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                     >
//                       {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                     {errors.password && touched.password && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <label className="flex items-center text-white">
//                       <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
//                       Remember Me
//                     </label>
//                     <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
//                       Forgot Password?
//                     </Link>
//                   </div>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                       isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
//                     }`}
//                   >
//                     {isSubmitting ? t('Logging in...') : t('Login')}
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           )}

//           {showMFAInput && (
//             <Formik
//               initialValues={{ mfaToken: '' }}
//               onSubmit={handleMFASubmit}
//             >
//               {({ isSubmitting }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Field
//                       name="mfaToken"
//                       type="text"
//                       className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder="Enter MFA Token"
//                     />
//                   </div>
//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//                   >
//                     Verify MFA
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           )}

//           {showMFASetup && (
//             <div className="space-y-6">
//               <p className="text-white">Scan the QR code with your authenticator app:</p>
//               <img src={mfaSetupData.qr_code} alt="MFA QR Code" className="mx-auto" />
//               <p className="text-white">Or enter this code manually: {mfaSetupData.secret}</p>
//               <Formik
//                 initialValues={{ mfaToken: '' }}
//                 onSubmit={handleMFASubmit}
//               >
//                 {({ isSubmitting }) => (
//                   <Form className="space-y-6">
//                     <div className="relative">
//                       <Field
//                         name="mfaToken"
//                         type="text"
//                         className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                         placeholder="Enter MFA Token to Verify"
//                       />
//                     </div>
//                     <motion.button
//                       type="submit"
//                       disabled={isSubmitting}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//                     >
//                       Verify and Enable MFA
//                     </motion.button>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           )}

//           {apiError && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{apiError}</span>
//               {apiError === 'Please confirm your email before logging in.' && (
//                 <button
//                   onClick={handleResendVerification}
//                   className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
//                 >
//                   Resend verification email
//                 </button>
//               )}
//             </motion.div>
//           )}

//           {emailSent && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
//             </motion.div>
//           )}
//           <p className="text-center text-white mt-6 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
//               Register
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, Star as StarIcon } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail, verifyMFA } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// const Star = ({ className }) => (
//   <StarIcon className={className} />
// );

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');
//   const [showMFAInput, setShowMFAInput] = useState(false);
//   const [currentEmail, setCurrentEmail] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const message = params.get('message');
//     const error = params.get('error');

//     if (message === 'email_confirmed') {
//       setConfirmationMessage('Your email has been confirmed. You can now log in.');
//     } else if (message === 'already_confirmed') {
//       setConfirmationMessage('Your email was already confirmed. Please log in.');
//     } else if (error === 'invalid_token') {
//       setConfirmationMessage('The confirmation link is invalid or has expired.');
//     }
//   }, [location]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await login(values.email, values.password);
//       setCurrentEmail(values.email);
      
//       if (response.data.require_mfa_setup) {
//         // Redirect to MFA setup page
//         navigate('/mfa-setup', { state: { userId: response.data.user_id } });
//         return;
//       }
      
//       if (response.data.require_mfa) {
//         setShowMFAInput(true);
//         setApiError('Please enter your MFA code');
//         localStorage.setItem('token', response.data.access_token);
//         return;
//       }
      
//       // User is authenticated, no MFA required
//       dispatch({ type: 'LOGIN', payload: response.data.user });
//       localStorage.setItem('token', response.data.access_token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleMFASubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await verifyMFA(values.mfaToken);
//       if (response.message === 'MFA enabled successfully') {
//         dispatch({ type: 'LOGIN', payload: { email: currentEmail, mfa_enabled: true } });
//         navigate('/dashboard');
//       } else {
//         setApiError('MFA verification failed. Please try again.');
//       }
//     } catch (error) {
//       setApiError('Invalid MFA token. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!currentEmail) {
//       setApiError('Please enter your email first.');
//       return;
//     }
//     try {
//       await sendVerificationEmail(currentEmail);
//       setEmailSent(true);
//       setApiError('');
//     } catch (error) {
//       console.error('Failed to resend verification email:', error);
//       setApiError('Failed to resend verification email. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
//       >
//         {/* Left side with doctor image */}
//         <div className="w-full md:w-1/2 relative">
//           <img 
//             src={doctorImage}
//             alt="Doctor" 
//             className="object-cover w-full h-64 md:h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
//           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
//           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
//           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
//           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
//         </div>

//         {/* Right side with login form */}
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
//           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
//           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
//           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
//           <p className="text-blue-100 mb-8">Login to Your Account</p>
          
//           {confirmationMessage && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{confirmationMessage}</span>
//             </motion.div>
//           )}

//           {!showMFAInput ? (
//             <Formik
//               initialValues={{ email: '', password: '', showPassword: false, rememberMe: false }}
//               validationSchema={loginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="email"
//                       type="email"
//                       className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Email Address')}
//                     />
//                     {errors.email && touched.email && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.email}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                     <Field
//                       name="password"
//                       type={values.showPassword ? 'text' : 'password'}
//                       className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder={t('Password')}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//                     >
//                       {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                     {errors.password && touched.password && (
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-red-300 text-sm mt-1"
//                       >
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <label className="flex items-center text-white">
//                       <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
//                       Remember Me
//                     </label>
//                     <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
//                       Forgot Password?
//                     </Link>
//                   </div>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
//                       isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
//                     }`}
//                   >
//                     {isSubmitting ? t('Logging in...') : t('Login')}
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           ) : (
//             <Formik
//               initialValues={{ mfaToken: '' }}
//               onSubmit={handleMFASubmit}
//             >
//               {({ isSubmitting }) => (
//                 <Form className="space-y-6">
//                   <div className="relative">
//                     <Field
//                       name="mfaToken"
//                       type="text"
//                       className="w-full pl-4 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//                       placeholder="Enter MFA Token"
//                     />
//                   </div>
//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg"
//                   >
//                     Verify MFA
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>
//           )}

//           {apiError && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">{apiError}</span>
//               {apiError === 'Please confirm your email before logging in.' && (
//                 <button
//                   onClick={handleResendVerification}
//                   className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
//                 >
//                   Resend verification email
//                 </button>
//               )}
//             </motion.div>
//           )}

//           {emailSent && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
//               role="alert"
//             >
//               <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
//             </motion.div>
//           )}

//           <p className="text-center text-white mt-6 text-sm">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
//               Register
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Key, Star as StarIcon } from 'lucide-react';
import { loginSchema } from '../utils/validation';
import { login, sendVerificationEmail,checkMFAStatus } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import doctorImage from './doctor.jpg';

const Star = ({ className }) => (
  <StarIcon className={className} />
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { dispatch } = useAuth();

  const [emailSent, setEmailSent] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [isMFASetup, setIsMFASetup] = useState(true); // Assume MFA is set up by default
  const [mfaRequired, setMFARequired] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const message = params.get('message');
  const error = params.get('error');

  if (message === 'email_confirmed') {
    setConfirmationMessage('Your email has been confirmed. You can now log in.');
  } else if (message === 'already_confirmed') {
    setConfirmationMessage('Your email was already confirmed. Please log in.');
  } else if (error === 'invalid_token') {
    setConfirmationMessage('The confirmation link is invalid or has expired.');
  }
}, [location]);

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const response = await login(values.email, values.password, values.mfaToken);
    setCurrentEmail(values.email);
    
    if (response.requireMFASetup) {
      navigate('/mfa-setup', { state: { userId: response.userId } });
      return;
    }

    if (response.require_mfa && !values.mfaToken) {
      setApiError('MFA token is required.');
      setMFARequired(true); // Show the MFA token field
      return;
    }

    // If login is successful and no MFA required, proceed to the dashboard
    dispatch({ type: 'LOGIN', payload: response.user });
    localStorage.setItem('token', response.access_token);

    // Check MFA status after successful login
    const mfaStatus = await checkMFAStatus();
    if (!mfaStatus.isMFASetup) {
      navigate('/mfa-setup');
    } else {
      navigate('/dashboard');
    }
    
  } catch (error) {
    if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
      setApiError(error.response.data.message);
      setEmailSent(false);
    } else if (error.response && error.response.data) {
      setApiError(error.response.data.message || 'Invalid credentials.');
    } else {
      setApiError('An error occurred during login.');
    }
  } finally {
    setSubmitting(false);
  }
};
  const handleResendVerification = async () => {
    if (!currentEmail) {
      setApiError('Please enter your email first.');
      return;
    }
    try {
      await sendVerificationEmail(currentEmail);
      setEmailSent(true);
      setApiError('');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setApiError('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
      >
        <div className="w-full md:w-1/2 relative">
          <img 
            src={doctorImage}
            alt="Doctor" 
            className="object-cover w-full h-64 md:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
          <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
          <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
          <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
          <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
          <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
          <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
          <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-blue-100 mb-8">Login to Your Account</p>
          
          {confirmationMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
              role="alert"
            >
              <span className="block sm:inline">{confirmationMessage}</span>
            </motion.div>
          )}

          <Formik
            initialValues={{ email: '', password: '', showPassword: false, rememberMe: false }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                  <Field
                    name="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder={t('Email Address')}
                  />
                  {errors.email && touched.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-300 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                  <Field
                    name="password"
                    type={values.showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder={t('Password')}
                  />
                  <button
                    type="button"
                    onClick={() => setFieldValue('showPassword', !values.showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && touched.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-300 text-sm mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
                {/* MFA Token Field */}
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                  <Field
                    name="mfaToken"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder={t('MFA Token')}
                  />
                  {errors.mfaToken && touched.mfaToken && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-300 text-sm mt-1"
                    >
                      {errors.mfaToken}
                    </motion.p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center text-white">
                    <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
                    Remember Me
                  </label>
                  <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? t('Logging in...') : t('Login')}
                </motion.button>
              </Form>
            )}
          </Formik>

          {apiError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
              role="alert"
            >
              <span className="block sm:inline">{apiError}</span>
              {apiError === 'Please confirm your email before logging in.' && (
                <button
                  onClick={handleResendVerification}
                  className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
                >
                  Resend verification email
                </button>
              )}
            </motion.div>
          )}

          {emailSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
              role="alert"
            >
              <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
            </motion.div>
          )}

          <p className="text-center text-white mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium hover:underline transition-all duration-200">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;