// // import React, { useState, useEffect } from 'react';
// // import { Formik, Form, Field } from 'formik';
// // import { motion } from 'framer-motion';
// // import { Link, useNavigate, useLocation } from 'react-router-dom';
// // import { Eye, EyeOff, Mail, Lock, Key, Star as StarIcon } from 'lucide-react';
// // import { loginSchema } from '../utils/validation';
// // import { login, sendVerificationEmail,checkMFAStatus } from '../services/api';
// // import { useTranslation } from 'react-i18next';
// // import { useAuth } from '../contexts/AuthContext';
// // import doctorImage from './doctor.jpg';

// // const Star = ({ className }) => (
// //   <StarIcon className={className} />
// // );

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { t } = useTranslation();
// //   const { dispatch } = useAuth();

// //   const [emailSent, setEmailSent] = useState(false);
// //   const [confirmationMessage, setConfirmationMessage] = useState('');
// //   const [apiError, setApiError] = useState('');
// //   const [currentEmail, setCurrentEmail] = useState('');
// //   const [isMFASetup, setIsMFASetup] = useState(true); // Assume MFA is set up by default
// //   const [mfaRequired, setMFARequired] = useState(false);

// // useEffect(() => {
// //   const params = new URLSearchParams(location.search);
// //   const message = params.get('message');
// //   const error = params.get('error');

// //   if (message === 'email_confirmed') {
// //     setConfirmationMessage('Your email has been confirmed. You can now log in.');
// //   } else if (message === 'already_confirmed') {
// //     setConfirmationMessage('Your email was already confirmed. Please log in.');
// //   } else if (error === 'invalid_token') {
// //     setConfirmationMessage('The confirmation link is invalid or has expired.');
// //   }
// // }, [location]);

// // const handleSubmit = async (values, { setSubmitting }) => {
// //   try {
// //     const response = await login(values.email, values.password, values.mfaToken);
// //     setCurrentEmail(values.email);
    
// //     if (response.requireMFASetup) {
// //       navigate('/mfa-setup', { state: { userId: response.userId } });
// //       return;
// //     }

// //     if (response.require_mfa && !values.mfaToken) {
// //       setApiError('MFA token is required.');
// //       setMFARequired(true); // Show the MFA token field
// //       return;
// //     }

// //     // If login is successful and no MFA required, proceed to the dashboard
// //     dispatch({ type: 'LOGIN', payload: response.user });
// //     localStorage.setItem('token', response.access_token);

// //     // Check MFA status after successful login
// //     const mfaStatus = await checkMFAStatus();
// //     if (!mfaStatus.isMFASetup) {
// //       navigate('/mfa-setup');
// //     } else {
// //       navigate('/dashboard');
// //     }
    
// //   } catch (error) {
// //     if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
// //       setApiError(error.response.data.message);
// //       setEmailSent(false);
// //     } else if (error.response && error.response.data) {
// //       setApiError(error.response.data.message || 'Invalid credentials.');
// //     } else {
// //       setApiError('An error occurred during login.');
// //     }
// //   } finally {
// //     setSubmitting(false);
// //   }
// // };
// //   const handleResendVerification = async () => {
// //     if (!currentEmail) {
// //       setApiError('Please enter your email first.');
// //       return;
// //     }
// //     try {
// //       await sendVerificationEmail(currentEmail);
// //       setEmailSent(true);
// //       setApiError('');
// //     } catch (error) {
// //       console.error('Failed to resend verification email:', error);
// //       setApiError('Failed to resend verification email. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white flex items-center justify-center p-4">
// //       <motion.div
// //         initial={{ opacity: 0, y: -50 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300"
// //       >
// //         <div className="w-full md:w-1/2 relative">
// //           <img 
// //             src={doctorImage}
// //             alt="Doctor" 
// //             className="object-cover w-full h-64 md:h-full"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20"></div>
// //           <Star className="absolute top-6 left-6 w-8 h-8 text-white" />
// //           <Star className="absolute top-1/4 right-12 w-6 h-6 text-white" />
// //           <Star className="absolute bottom-1/3 left-12 w-7 h-7 text-white" />
// //           <Star className="absolute bottom-10 right-8 w-8 h-8 text-white" />
// //         </div>

// //         <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-300 to-blue-500 p-8 md:p-12 flex flex-col justify-center relative">
// //           <Star className="absolute top-8 right-8 w-6 h-6 text-white opacity-50" />
// //           <Star className="absolute bottom-1/4 left-10 w-5 h-5 text-white opacity-30" />
// //           <Star className="absolute bottom-16 right-12 w-7 h-7 text-white opacity-40" />
          
// //           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
// //           <p className="text-blue-100 mb-8">Login to Your Account</p>
          
// //           {confirmationMessage && (
// //             <motion.div
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
// //               role="alert"
// //             >
// //               <span className="block sm:inline">{confirmationMessage}</span>
// //             </motion.div>
// //           )}

// //           <Formik
// //             initialValues={{ email: '', password: '', showPassword: false, rememberMe: false }}
// //             validationSchema={loginSchema}
// //             onSubmit={handleSubmit}
// //           >
// //             {({ errors, touched, isSubmitting, values, setFieldValue }) => (
// //               <Form className="space-y-6">
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
// //                   <Field
// //                     name="email"
// //                     type="email"
// //                     className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
// //                     placeholder={t('Email Address')}
// //                   />
// //                   {errors.email && touched.email && (
// //                     <motion.p
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       className="text-red-300 text-sm mt-1"
// //                     >
// //                       {errors.email}
// //                     </motion.p>
// //                   )}
// //                 </div>

// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
// //                   <Field
// //                     name="password"
// //                     type={values.showPassword ? 'text' : 'password'}
// //                     className="w-full pl-10 pr-12 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
// //                     placeholder={t('Password')}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setFieldValue('showPassword', !values.showPassword)}
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
// //                   >
// //                     {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// //                   </button>
// //                   {errors.password && touched.password && (
// //                     <motion.p
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       className="text-red-300 text-sm mt-1"
// //                     >
// //                       {errors.password}
// //                     </motion.p>
// //                   )}
// //                 </div>
// //                 {/* MFA Token Field */}
// //                 <div className="relative">
// //                   <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
// //                   <Field
// //                     name="mfaToken"
// //                     type="text"
// //                     className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
// //                     placeholder={t('MFA Token')}
// //                   />
// //                   {errors.mfaToken && touched.mfaToken && (
// //                     <motion.p
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       className="text-red-300 text-sm mt-1"
// //                     >
// //                       {errors.mfaToken}
// //                     </motion.p>
// //                   )}
// //                 </div>

// //                 <div className="flex justify-between items-center text-sm">
// //                   <label className="flex items-center text-white">
// //                     <Field type="checkbox" name="rememberMe" className="mr-2 rounded focus:ring-blue-500 transition-all duration-200" />
// //                     Remember Me
// //                   </label>
// //                   <Link to="/forgot-password" className="text-white hover:underline transition-all duration-200">
// //                     Forgot Password?
// //                   </Link>
// //                 </div>

// //                 <motion.button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                   className={`w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-full transition-all duration-300 ${
// //                     isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-lg'
// //                   }`}
// //                 >
// //                   {isSubmitting ? t('Logging in...') : t('Login')}
// //                 </motion.button>
// //               </Form>
// //             )}
// //           </Formik>

// //           {apiError && (
// //             <motion.div
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
// //               role="alert"
// //             >
// //               <span className="block sm:inline">{apiError}</span>
// //               {apiError === 'Please confirm your email before logging in.' && (
// //                 <button
// //                   onClick={handleResendVerification}
// //                   className="underline ml-2 text-red-700 hover:text-red-800 transition-colors duration-200"
// //                 >
// //                   Resend verification email
// //                 </button>
// //               )}
// //             </motion.div>
// //           )}

// //           {emailSent && (
// //             <motion.div
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
// //               role="alert"
// //             >
// //               <span className="block sm:inline">Verification email sent. Please check your inbox.</span>
// //             </motion.div>
// //           )}

// //           <p className="text-center text-white mt-6 text-sm">
// //             Don't have an account?{' '}
// //             <Link to="/register" className="font-medium hover:underline transition-all duration-200">
// //               Register
// //             </Link>
// //           </p>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field } from 'formik';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Eye, EyeOff, Mail, Lock, Key, 
//   CheckCircle, AlertCircle, ShieldCheck, 
//   ArrowRight, Loader, Smartphone, RefreshCw
// } from 'lucide-react';
// import { loginSchema } from '../utils/validation';
// import { login, sendVerificationEmail, checkMFAStatus } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';
// import doctorImage from './doctor.jpg';

// // Particle animation component for background
// const ParticleBackground = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {[...Array(20)].map((_, i) => (
//         <div 
//           key={i}
//           className="absolute rounded-full bg-blue-500 opacity-20"
//           style={{
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//             width: `${Math.random() * 10 + 5}px`,
//             height: `${Math.random() * 10 + 5}px`,
//             animationDuration: `${Math.random() * 20 + 10}s`,
//             animationDelay: `${Math.random() * 5}s`,
//             animationName: 'float',
//             animationIterationCount: 'infinite',
//             animationTimingFunction: 'linear'
//           }}
//         />
//       ))}
//       <style jsx>{`
//         @keyframes float {
//           0% { transform: translate(0, 0) rotate(0deg); }
//           25% { transform: translate(50px, 25px) rotate(90deg); }
//           50% { transform: translate(0, 50px) rotate(180deg); }
//           75% { transform: translate(-50px, 25px) rotate(270deg); }
//           100% { transform: translate(0, 0) rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Custom input component
// const FormField = ({ icon: Icon, type, name, placeholder, errors, touched, onChange, onBlur, value, ...props }) => {
//   return (
//     <div className="relative mb-1">
//       <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
//         <Icon className="text-blue-600 opacity-70" size={18} />
//       </div>
//       <input
//         type={type}
//         name={name}
//         placeholder={placeholder}
//         onChange={onChange}
//         onBlur={onBlur}
//         value={value}
//         className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 
//           border ${errors && touched ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
//           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//         {...props}
//       />
//       {errors && touched && (
//         <motion.div 
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center mt-1 text-red-500"
//         >
//           <AlertCircle size={14} className="mr-1.5" />
//           <span className="text-xs">{errors}</span>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// // Alert component
// const Alert = ({ type, message, action, actionText }) => {
//   const colors = {
//     error: "bg-red-50 border-red-200 text-red-700",
//     success: "bg-green-50 border-green-200 text-green-700",
//     info: "bg-blue-50 border-blue-200 text-blue-700",
//     warning: "bg-yellow-50 border-yellow-200 text-yellow-700"
//   };
  
//   const icons = {
//     error: <AlertCircle size={16} className="flex-shrink-0 mr-2" />,
//     success: <CheckCircle size={16} className="flex-shrink-0 mr-2" />,
//     info: <ShieldCheck size={16} className="flex-shrink-0 mr-2" />,
//     warning: <AlertCircle size={16} className="flex-shrink-0 mr-2" />
//   };
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       className={`flex items-start p-3.5 rounded-lg border ${colors[type]} mb-4`}
//     >
//       {icons[type]}
//       <div className="flex-1 text-sm">
//         {message}
//         {action && (
//           <button
//             onClick={action}
//             className="underline ml-2 font-medium hover:opacity-80 transition-colors duration-200"
//           >
//             {actionText}
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // Main Login component
// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { t } = useTranslation();
//   const { dispatch } = useAuth();

//   const [emailSent, setEmailSent] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState('');
//   const [apiError, setApiError] = useState('');
//   const [currentEmail, setCurrentEmail] = useState('');
//   const [isMFASetup, setIsMFASetup] = useState(true);
//   const [mfaRequired, setMFARequired] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

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
//     setIsLoggingIn(true);
//     setApiError('');
//     try {
//       const response = await login(values.email, values.password, values.mfaToken);
//       setCurrentEmail(values.email);
      
//       if (response.requireMFASetup) {
//         navigate('/mfa-setup', { state: { userId: response.userId } });
//         return;
//       }

//       // if (response.require_mfa && !values.mfaToken) {
//       //   setApiError('MFA token is required for secure login.');
//       //   setMFARequired(true);
//       //   return;
//       // }
//       if ((response.require_mfa || response.requireMFA) && !values.mfaToken) {
//         setApiError('MFA token is required for secure login.');
//         setMFARequired(true);
//         return;
//       }

//       // If login is successful and no MFA required, proceed to the dashboard
//       dispatch({ type: 'LOGIN', payload: response.user });
//       localStorage.setItem('token', response.access_token);

//       // Check MFA status after successful login
//       const mfaStatus = await checkMFAStatus();
//       if (!mfaStatus.isMFASetup) {
//         navigate('/mfa-setup');
//       } else {
//         navigate('/dashboard');
//       }
      
//     } catch (error) {
//       if (error.response && error.response.status === 401 && error.response.data.message === 'Please confirm your email before logging in.') {
//         setApiError(error.response.data.message);
//         setEmailSent(false);
//       } else if (error.response && error.response.data) {
//         setApiError(error.response.data.message || 'Invalid credentials.');
//       } else {
//         setApiError('An error occurred during login.');
//       }
//     } finally {
//       setSubmitting(false);
//       setIsLoggingIn(false);
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
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-blue-500 opacity-5 pattern-dots pattern-size-2 pattern-diagonal-lines"></div>
//       <ParticleBackground />
      
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row"
//       >
//         {/* Left side - Image */}
//         <div className="w-full md:w-5/12 relative hidden md:block">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90"></div>
//           <img 
//             src={doctorImage}
//             alt="Medical Professional" 
//             className="object-cover w-full h-full"
//           />
//           <div className="absolute inset-0 flex flex-col justify-between p-10">
//             <div className="text-white">
//               <motion.div 
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.6 }}
//               >
//                 <h3 className="text-2xl font-bold mb-2">Medical Diagnosis System</h3>
//                 <p className="text-blue-100 text-sm">Advanced diagnostic tools for healthcare professionals</p>
//               </motion.div>
//             </div>
            
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
//               <div className="flex items-center mb-3">
//                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
//                   <ShieldCheck className="w-4 h-4" />
//                 </div>
//                 <h4 className="font-medium">Secure Access</h4>
//               </div>
//               <p className="text-sm text-blue-100">Our multi-factor authentication system ensures that patient data remains protected and secure.</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Right side - Login form */}
//         <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center relative">
//           <div className="max-w-md mx-auto w-full">
//             <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
//             <p className="text-gray-500 mb-6">Sign in to your account to continue</p>
            
//             <AnimatePresence>
//               {confirmationMessage && (
//                 <Alert type="success" message={confirmationMessage} />
//               )}
              
//               {apiError && (
//                 <Alert 
//                   type="error" 
//                   message={apiError} 
//                   action={apiError === 'Please confirm your email before logging in.' ? handleResendVerification : null}
//                   actionText="Resend verification email"
//                 />
//               )}
              
//               {emailSent && (
//                 <Alert 
//                   type="success" 
//                   message="Verification email sent. Please check your inbox." 
//                 />
//               )}
//             </AnimatePresence>

//             <Formik
//               initialValues={{ email: '', password: '', mfaToken: '', rememberMe: false }}
//               validationSchema={loginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
//                 <Form className="space-y-4">
//                   <FormField
//                     icon={Mail}
//                     type="email"
//                     name="email"
//                     placeholder="Email Address"
//                     errors={errors.email}
//                     touched={touched.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     value={values.email}
//                     autoComplete="email"
//                   />
                  
//                   <div className="relative">
//                     <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
//                       <Lock className="text-blue-600 opacity-70" size={18} />
//                     </div>
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       placeholder="Password"
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       value={values.password}
//                       className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 
//                         border ${errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
//                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                       autoComplete="current-password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                     {errors.password && touched.password && (
//                       <motion.div 
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex items-center mt-1 text-red-500"
//                       >
//                         <AlertCircle size={14} className="mr-1.5" />
//                         <span className="text-xs">{errors.password}</span>
//                       </motion.div>
//                     )}
//                   </div>

//                   {/* MFA Token Field - conditionally shown */}
//                   <div className="relative">
//   <AnimatePresence>
//     {(mfaRequired || values.mfaToken) && (
//       <>
//         {/* Backdrop overlay */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-[2px] z-10"
//           onClick={() => {/* Optional: Close on backdrop click */}}
//         />
        
//         {/* MFA Field */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: -10 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: -10 }}
//           transition={{ duration: 0.25, type: "spring", stiffness: 500, damping: 30 }}
//           className="absolute left-0 right-0 z-20"
//         >
//           <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 shadow-lg">
//             <div className="flex items-center mb-3">
//               <Smartphone size={16} className="text-blue-600 mr-2" />
//               <h4 className="text-sm font-medium text-blue-800">Two-Factor Authentication</h4>
//             </div>
//             <p className="text-xs text-blue-700 mb-3">
//               Please enter the 6-digit code from your authentication app.
//             </p>
//             <div className="relative">
//               <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
//                 <Key className="text-blue-600 opacity-70" size={18} />
//               </div>
//               <input
//                 type="text"
//                 name="mfaToken"
//                 placeholder="6-digit code"
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.mfaToken}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 
//                   border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
//                   focus:border-transparent transition-all duration-200"
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 maxLength={6}
//                 autoComplete="one-time-code"
//                 autoFocus
//               />
//               {errors.mfaToken && touched.mfaToken && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex items-center mt-1 text-red-500"
//                 >
//                   <AlertCircle size={14} className="mr-1.5" />
//                   <span className="text-xs">{errors.mfaToken}</span>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </>
//     )}
//   </AnimatePresence>
// </div>

//                   <div className="flex justify-between items-center text-sm mt-6">
//                     <label className="flex items-center text-gray-600 select-none">
//                       <input
//                         type="checkbox"
//                         name="rememberMe"
//                         onChange={handleChange}
//                         checked={values.rememberMe}
//                         className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 rounded focus:ring-blue-500 focus:ring-offset-0"
//                       />
//                       <span className="ml-2 text-sm">Remember Me</span>
//                     </label>
//                     <Link 
//                       to="/forgot-password" 
//                       className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200"
//                     >
//                       Forgot Password?
//                     </Link>
//                   </div>

//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting || isLoggingIn}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium 
//                       py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 
//                       ${(isSubmitting || isLoggingIn) ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg'}`}
//                   >
//                     {(isSubmitting || isLoggingIn) ? (
//                       <>
//                         <Loader className="animate-spin mr-2" size={18} />
//                         {t('Authenticating...')}
//                       </>
//                     ) : (
//                       <>
//                         {t('Sign In')}
//                         <ArrowRight size={18} className="ml-2" />
//                       </>
//                     )}
//                   </motion.button>
//                 </Form>
//               )}
//             </Formik>

//             <div className="mt-8 text-center">
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{' '}
//                 <Link 
//                   to="/register" 
//                   className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-200"
//                 >
//                   Create an account
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-10 pt-6 border-t border-gray-200">
//               <div className="flex items-center space-x-2 text-xs text-gray-500 justify-center">
//                 <ShieldCheck size={14} />
//                 <span>Secure login protected by AES-256 encryption</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, Key, 
  CheckCircle, AlertCircle, ShieldCheck, 
  ArrowRight, Loader, Smartphone, RefreshCw
} from 'lucide-react';
import { loginSchema } from '../utils/validation';
import { login, sendVerificationEmail, checkMFAStatus } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import doctorImage from './doctor.jpg';

// Particle animation component for background
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-blue-500 opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            animationName: 'float',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, 25px) rotate(90deg); }
          50% { transform: translate(0, 50px) rotate(180deg); }
          75% { transform: translate(-50px, 25px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes progress {
          0% { width: 0% }
          100% { width: 100% }
        }
        .animate-progress {
          animation: progress 1.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

// Custom input component
const FormField = ({ icon: Icon, type, name, placeholder, errors, touched, onChange, onBlur, value, ...props }) => {
  return (
    <div className="relative mb-1">
      <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
        <Icon className="text-blue-600 opacity-70" size={18} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 
          border ${errors && touched ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        {...props}
      />
      {errors && touched && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-1 text-red-500"
        >
          <AlertCircle size={14} className="mr-1.5" />
          <span className="text-xs">{errors}</span>
        </motion.div>
      )}
    </div>
  );
};

// Alert component
const Alert = ({ type, message, action, actionText }) => {
  const colors = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700"
  };
  
  const icons = {
    error: <AlertCircle size={16} className="flex-shrink-0 mr-2" />,
    success: <CheckCircle size={16} className="flex-shrink-0 mr-2" />,
    info: <ShieldCheck size={16} className="flex-shrink-0 mr-2" />,
    warning: <AlertCircle size={16} className="flex-shrink-0 mr-2" />
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start p-3.5 rounded-lg border ${colors[type]} mb-4`}
    >
      {icons[type]}
      <div className="flex-1 text-sm">
        {message}
        {action && (
          <button
            onClick={action}
            className="underline ml-2 font-medium hover:opacity-80 transition-colors duration-200"
          >
            {actionText}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main Login component
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { dispatch } = useAuth();

  const [emailSent, setEmailSent] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [isMFASetup, setIsMFASetup] = useState(true);
  const [mfaRequired, setMFARequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Add auth success states
  const [authSuccess, setAuthSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

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
    setIsLoggingIn(true);
    setApiError('');
    try {
      const response = await login(values.email, values.password, values.mfaToken);
      setCurrentEmail(values.email);
      
      if (response.requireMFASetup) {
        navigate('/mfa-setup', { state: { userId: response.userId } });
        return;
      }

      if ((response.require_mfa || response.requireMFA) && !values.mfaToken) {
        setApiError('MFA token is required for secure login.');
        setMFARequired(true);
        return;
      }

      // If login is successful and no MFA required, proceed to the dashboard
      dispatch({ type: 'LOGIN', payload: response.user });
      localStorage.setItem('token', response.access_token);

      // Set success state and delay redirect
      setAuthSuccess(true);
      setRedirecting(true);

      // Delay redirect to dashboard to show success message
      setTimeout(() => {
        // Check MFA status after successful login
        const checkMFAAndRedirect = async () => {
          try {
            const mfaStatus = await checkMFAStatus();
            if (!mfaStatus.isMFASetup) {
              navigate('/mfa-setup');
            } else {
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Error checking MFA status:', error);
            navigate('/dashboard'); // Fallback to dashboard on error
          }
        };
        
        checkMFAAndRedirect();
      }, 1500); // 1.5 second delay before redirect
      
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
      setIsLoggingIn(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-500 opacity-5 pattern-dots pattern-size-2 pattern-diagonal-lines"></div>
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row"
      >
        {/* Left side - Image */}
        <div className="w-full md:w-5/12 relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90"></div>
          <img 
            src={doctorImage}
            alt="Medical Professional" 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-10">
            <div className="text-white">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-2">Medical Diagnosis System</h3>
                <p className="text-blue-100 text-sm">Advanced diagnostic tools for healthcare professionals</p>
              </motion.div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-medium">Secure Access</h4>
              </div>
              <p className="text-sm text-blue-100">Our multi-factor authentication system ensures that patient data remains protected and secure.</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Sign in to your account to continue</p>
            
            <AnimatePresence>
              {confirmationMessage && (
                <Alert type="success" message={confirmationMessage} />
              )}
              
              {apiError && (
                <Alert 
                  type="error" 
                  message={apiError} 
                  action={apiError === 'Please confirm your email before logging in.' ? handleResendVerification : null}
                  actionText="Resend verification email"
                />
              )}
              
              {emailSent && (
                <Alert 
                  type="success" 
                  message="Verification email sent. Please check your inbox." 
                />
              )}
            </AnimatePresence>

            <Formik
              initialValues={{ email: '', password: '', mfaToken: '', rememberMe: false }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
                <Form className="space-y-4">
                  <FormField
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    errors={errors.email}
                    touched={touched.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    autoComplete="email"
                  />
                  
                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                      <Lock className="text-blue-600 opacity-70" size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 
                        border ${errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && touched.password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-1 text-red-500"
                      >
                        <AlertCircle size={14} className="mr-1.5" />
                        <span className="text-xs">{errors.password}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* MFA Token Field - conditionally shown */}
                  <div className="relative">
                    <AnimatePresence>
                      {(mfaRequired || values.mfaToken) && (
                        <>
                          {/* Backdrop overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-[2px] z-10"
                            onClick={() => {/* Optional: Close on backdrop click */}}
                          />
                          
                          {/* MFA Field */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.25, type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute left-0 right-0 z-20"
                          >
                            <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 shadow-lg">
                              <div className="flex items-center mb-3">
                                <Smartphone size={16} className="text-blue-600 mr-2" />
                                <h4 className="text-sm font-medium text-blue-800">Two-Factor Authentication</h4>
                              </div>
                              <p className="text-xs text-blue-700 mb-3">
                                Please enter the 6-digit code from your authentication app.
                              </p>
                              <div className="relative">
                                <div className="absolute left-0 inset-y-0 w-12 flex items-center justify-center">
                                  <Key className="text-blue-600 opacity-70" size={18} />
                                </div>
                                <input
                                  type="text"
                                  name="mfaToken"
                                  placeholder="6-digit code"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.mfaToken}
                                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 
                                    border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    focus:border-transparent transition-all duration-200"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={6}
                                  autoComplete="one-time-code"
                                  autoFocus
                                />
                                {errors.mfaToken && touched.mfaToken && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center mt-1 text-red-500"
                                  >
                                    <AlertCircle size={14} className="mr-1.5" />
                                    <span className="text-xs">{errors.mfaToken}</span>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between items-center text-sm mt-6">
                    <label className="flex items-center text-gray-600 select-none">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        onChange={handleChange}
                        checked={values.rememberMe}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 rounded focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-sm">Remember Me</span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isLoggingIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium 
                      py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 
                      ${(isSubmitting || isLoggingIn) ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  >
                    {(isSubmitting || isLoggingIn) ? (
                      <>
                        <Loader className="animate-spin mr-2" size={18} />
                        {t('Authenticating...')}
                      </>
                    ) : (
                      <>
                        {t('Sign In')}
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </Form>
              )}
            </Formik>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-500 justify-center">
                <ShieldCheck size={14} />
                <span>Secure login protected by AES-256 encryption</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Message Overlay */}
      <AnimatePresence>
        {authSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-[2px]"></div>
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Authentication Successful</h3>
                  <p className="text-gray-500">{redirecting ? 'Redirecting to dashboard...' : 'Welcome back!'}</p>
                </div>
              </div>
              
              {redirecting && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full animate-progress"></div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;