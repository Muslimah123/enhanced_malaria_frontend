// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Eye, EyeOff, UserCheck, ArrowLeft, Facebook, Twitter, Zap, Activity, Clock, Microscope, Hospital, ChartBar, Moon, Sun } from 'lucide-react';
// import { registerSchema } from '../utils/validation';
// import { register } from '../services/api';
// import { useTranslation } from 'react-i18next';
// import zxcvbn from 'zxcvbn';
// import RegistrationSuccess from './RegistrationSuccess';
// import MFASetup from './MFASetup';
// import EmailVerificationSuccess from './EmailVerificationSuccess';


// const PasswordStrengthIndicator = ({ password }) => {
//   const result = zxcvbn(password);
//   const strength = (result.score * 100) / 4;

//   const getStrengthLabel = (score) => {
//     switch(score) {
//       case 0: return "Very Weak";
//       case 1: return "Weak";
//       case 2: return "Fair";
//       case 3: return "Strong";
//       case 4: return "Very Strong";
//       default: return "Very Weak";
//     }
//   };

//   return (
//     <div className="mt-2">
//       <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
//         <motion.div
//           className="h-full"
//           initial={{ width: 0 }}
//           animate={{ width: `${strength}%` }}
//           style={{
//             backgroundColor: `hsl(${strength}, 100%, 50%)`,
//           }}
//           transition={{ duration: 0.5 }}
//         />
//       </div>
//       <motion.p 
//         className="text-sm mt-1 text-gray-600"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//       >
//         Password strength: {getStrengthLabel(result.score)}
//       </motion.p>
//       <ul className="text-sm mt-1 text-gray-600">
//         {result.feedback.suggestions.map((suggestion, index) => (
//           <li key={index}>{suggestion}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const GoogleIcon = ({ size = 24 }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10"></circle>
//     <path d="M8 12 L16 12 M12 8 L12 16"></path>
//   </svg>
// );

// const Register = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showMFASetup, setShowMFASetup] = useState(false); // State to trigger MFA setup


//   const [initialValues, setInitialValues] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'doctor',
//     termsAccepted: false,
//   });

//   useEffect(() => {
//     const savedForm = localStorage.getItem('registrationForm');
//     if (savedForm) {
//       setInitialValues(JSON.parse(savedForm));
//     }
//   }, []);

//   const handleSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const response = await register(values);
//       if (response.data.email_sent) {
//         setRegistrationSuccess(true);
//       } else {
//         navigate('/login');
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrors({ api: error.response.data.message || 'An error occurred during registration.' });
//       } else {
//         setErrors({ api: 'An error occurred during registration.' });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleMFASetupComplete = () => {
//     navigate('/login'); // Redirect to login after MFA setup is complete
//   };

//   const validateEmail = (value) => {
//     let error;
//     if (!value) {
//       error = 'Required';
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
//       error = 'Invalid email address';
//     }
//     return error;
//   };

//   // Email verified, now show MFA setup
//   if (showMFASetup) {
//     return <MFASetup onSetupComplete={handleMFASetupComplete} />;
//   }

//   // Email verification success screen before showing MFA setup
//   if (emailVerified) {
//     return <EmailVerificationSuccess />;
//   }

//   if (registrationSuccess) {
//     return <RegistrationSuccess />;
//   }
//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-cyan-300 to-blue-500'} flex flex-col transition-colors duration-300`}>
//       <header className="w-full bg-cyan-500 p-4 flex justify-between items-center">
//         <Link to="/" className="text-white text-2xl font-bold">MalariaAI</Link>
//         <button onClick={() => setDarkMode(!darkMode)} className="text-white">
//           {darkMode ? <Sun /> : <Moon />}
//         </button>
//       </header>

//       <div className="flex-grow flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row`}
//         >
//           <div className={`w-full md:w-1/2 p-12 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-cyan-100 to-blue-200'} relative overflow-hidden`}>
//             <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-8 transition-colors duration-300">
//               <ArrowLeft size={20} className="mr-2" />
//               Back to Home
//             </Link>
//             <h1 className="text-4xl font-bold text-blue-800 mb-6">Join MalariaAI</h1>
//             <p className="text-lg text-blue-700 mb-8">
//               Empower your malaria diagnosis with our AI-powered platform.
//             </p>
//             <div className="space-y-6">
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="flex items-center space-x-4"
//               >
//                 <div className="bg-cyan-500 p-3 rounded-full">
//                   <Zap className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-blue-800">Fast Results</h3>
//                   <p className="text-blue-700">Get diagnostic results in minutes</p>
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex items-center space-x-4"
//               >
//                 <div className="bg-cyan-500 p-3 rounded-full">
//                   <Activity className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-blue-800">High Accuracy</h3>
//                   <p className="text-blue-700">AI-powered analysis for precise diagnoses</p>
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="flex items-center space-x-4"
//               >
//                 <div className="bg-cyan-500 p-3 rounded-full">
//                   <Clock className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-blue-800">24/7 Availability</h3>
//                   <p className="text-blue-700">Access the platform anytime, anywhere</p>
//                 </div>
//               </motion.div>
//             </div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="mt-8"
//             >
//               <h3 className="text-2xl font-bold text-blue-800 mb-4">Who Can Benefit</h3>
//               <ul className="space-y-2 text-blue-700">
//                 <li className="flex items-center">
//                   <Hospital size={20} className="mr-2 text-cyan-500" />
//                   Doctors and clinicians in malaria-endemic regions
//                 </li>
//                 <li className="flex items-center">
//                   <Microscope size={20} className="mr-2 text-cyan-500" />
//                   Laboratory technicians processing large numbers of samples
//                 </li>
//                 <li className="flex items-center">
//                   <ChartBar size={20} className="mr-2 text-cyan-500" />
//                   Research institutions studying malaria
//                 </li>
//                 <li className="flex items-center">
//                   <Activity size={20} className="mr-2 text-cyan-500" />
//                   Healthcare administrators managing malaria control programs
//                 </li>
//               </ul>
//             </motion.div>
//             <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-200 rounded-full -mr-32 -mb-32 z-0 opacity-50"></div>
//             <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -ml-16 -mt-16 z-0 opacity-50"></div>
//           </div>
//           <div className={`w-full md:w-1/2 p-12 relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
//             <Formik
//               initialValues={initialValues}
//               validationSchema={registerSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting, values, setFieldValue }) => (
//                 <Form className="space-y-4">
//                   <AnimatePresence mode="wait">
//                     {currentStep === 1 && (
//                       <motion.div
//                         key="step1"
//                         initial={{ opacity: 0, x: 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -50 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <div className="relative">
//                           <Field
//                             name="username"
//                             className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//                             placeholder={t('Username')}
//                           />
//                           <User className="absolute top-3.5 left-3 text-gray-400" size={20} />
//                           <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>

//                         <div className="relative mt-4">
//                           <Field
//                             name="email"
//                             validate={validateEmail}
//                             className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//                             placeholder={t('Email')}
//                           />
//                           <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
//                           <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => setCurrentStep(2)}
//                           className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
//                         >
//                           {t('Next')}
//                         </button>
//                       </motion.div>
//                     )}

//                     {currentStep === 2 && (
//                       <motion.div
//                         key="step2"
//                         initial={{ opacity: 0, x: 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -50 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <div className="relative">
//                           <Field
//                             name="password"
//                             type={values.showPassword ? 'text' : 'password'}
//                             className="pl-10 pr-10 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//                             placeholder={t('Password')}
//                           />
//                           <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
//                           <button
//                             type="button"
//                             onClick={() => setFieldValue('showPassword', !values.showPassword)}
//                             className="absolute top-3.5 right-3 text-gray-400 focus:outline-none"
//                           >
//                             {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                           </button>
//                           <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>
//                         <PasswordStrengthIndicator password={values.password} />

//                         <div className="relative mt-4">
//                           <Field
//                             as="select"
//                             name="role"
//                             className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//                           >
//                             <option value="doctor">{t('Doctor')}</option>
//                             <option value="lab_technician">{t('Lab Technician')}</option>
//                             <option value="admin">{t('Admin')}</option>
//                           </Field>
//                           <UserCheck className="absolute top-3.5 left-3 text-gray-400" size={20} />
//                           <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
//                         </div>
//                         <div className="flex items-center mt-4">
//                       <Field
//                         type="checkbox"
//                         name="termsAccepted"
//                         className="mr-2 rounded focus:ring-cyan-500 h-4 w-4 text-cyan-600 transition duration-150 ease-in-out"
//                       />
//                       <label htmlFor="termsAccepted" className="text-sm text-gray-600">
//                         I accept the <a href="/terms" className="text-cyan-600 hover:underline">terms and conditions</a>
//                       </label>
//                     </div>
//                     <ErrorMessage name="termsAccepted" component="div" className="text-red-500 text-sm mt-1" />

//                     <div className="flex space-x-4 mt-6">
//                       <button
//                         type="button"
//                         onClick={() => setCurrentStep(1)}
//                         className="w-1/2 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
//                       >
//                         {t('Back')}
//                       </button>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         type="submit"
//                         disabled={isSubmitting}
//                         className={`w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out ${
//                           isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-600'
//                         }`}
//                       >
//                         {isSubmitting ? t('Submitting...') : t('Submit')}
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {errors.api && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
//                   role="alert"
//                 >
//                   <span className="block sm:inline">{errors.api}</span>
//                 </motion.div>
//               )}
//             </Form>
//           )}
//         </Formik>

//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="mt-6"
//         >
//           <p className="text-center text-sm text-gray-600 mb-4">{t('Or sign up with')}</p>
//           <div className="flex justify-center space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="bg-blue-600 text-white p-2 rounded-full"
//             >
//               <Facebook size={24} />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="bg-blue-400 text-white p-2 rounded-full"
//             >
//               <Twitter size={24} />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="bg-red-500 text-white p-2 rounded-full"
//             >
//               <GoogleIcon size={24} />
//             </motion.button>
//           </div>
//         </motion.div>

//         <motion.p
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.7 }}
//           className="text-center text-gray-600 mt-6"
//         >
//           Already have an account?{' '}
//           <Link to="/Login" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-300">
//             Log in here
//           </Link>
//         </motion.p>
//       </div>
//     </motion.div>
//   </div>
// </div>
// );
// };
// export default Register;
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserCheck, ArrowLeft, Facebook, Twitter, Zap, Activity, Clock, Microscope, Hospital, ChartBar, Moon, Sun } from 'lucide-react';
import { registerSchema } from '../utils/validation';
import { register } from '../services/api';
import { useTranslation } from 'react-i18next';
import zxcvbn from 'zxcvbn';
import RegistrationSuccess from './RegistrationSuccess';
import MFASetup from './MFASetup';
import EmailVerificationSuccess from './EmailVerificationSuccess';


const PasswordStrengthIndicator = ({ password }) => {
  const result = zxcvbn(password);
  const strength = (result.score * 100) / 4;

  const getStrengthLabel = (score) => {
    switch(score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "Very Weak";
    }
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          style={{
            backgroundColor: `hsl(${strength}, 100%, 50%)`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <motion.p 
        className="text-sm mt-1 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Password strength: {getStrengthLabel(result.score)}
      </motion.p>
      <ul className="text-sm mt-1 text-gray-600">
        {result.feedback.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};
const GoogleIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 12 L16 12 M12 8 L12 16"></path>
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false); // State to trigger MFA setup

  const [initialValues, setInitialValues] = useState({
    username: '',
    email: '',
    password: '',
    role: 'doctor',
    termsAccepted: false,
  });

  useEffect(() => {
    const savedForm = localStorage.getItem('registrationForm');
    if (savedForm) {
      setInitialValues(JSON.parse(savedForm));
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await register(values);
      if (response.data.email_sent) {
        setRegistrationSuccess(true);
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ api: error.response.data.message || 'An error occurred during registration.' });
      } else {
        setErrors({ api: 'An error occurred during registration.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleMFASetupComplete = () => {
    navigate('/login'); // Redirect to login after MFA setup is complete
  };

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  // Email verified, now show MFA setup
  if (showMFASetup) {
    return <MFASetup onSetupComplete={handleMFASetupComplete} />;
  }

  // Email verification success screen before showing MFA setup
  if (emailVerified) {
    return <EmailVerificationSuccess />;
  }

  if (registrationSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-cyan-300 to-blue-500'} flex flex-col transition-colors duration-300`}>
      <header className="w-full bg-cyan-500 p-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">MalariaAI</Link>
        <button onClick={() => setDarkMode(!darkMode)} className="text-white">
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row`}
        >
          <div className={`w-full md:w-1/2 p-12 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-cyan-100 to-blue-200'} relative overflow-hidden`}>
            <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-8 transition-colors duration-300">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-blue-800 mb-6">Join MalariaAI</h1>
            <p className="text-lg text-blue-700 mb-8">
              Empower your malaria diagnosis with our AI-powered platform.
            </p>
            <div className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-cyan-500 p-3 rounded-full">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Fast Results</h3>
                  <p className="text-blue-700">Get diagnostic results in minutes</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-cyan-500 p-3 rounded-full">
                  <Activity className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">High Accuracy</h3>
                  <p className="text-blue-700">AI-powered analysis for precise diagnoses</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-cyan-500 p-3 rounded-full">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">24/7 Availability</h3>
                  <p className="text-blue-700">Access the platform anytime, anywhere</p>
                </div>
              </motion.div>
            </div>
          </div>
          <div className={`w-full md:w-1/2 p-12 relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <Field
                            name="username"
                            className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                            placeholder={t('Username')}
                          />
                          <User className="absolute top-3.5 left-3 text-gray-400" size={20} />
                          <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="relative mt-4">
                          <Field
                            name="email"
                            validate={validateEmail}
                            className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                            placeholder={t('Email')}
                          />
                          <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
                        >
                          {t('Next')}
                        </button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <Field
                            name="password"
                            type={values.showPassword ? 'text' : 'password'}
                            className="pl-10 pr-10 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                            placeholder={t('Password')}
                          />
                          <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
                          <button
                            type="button"
                            onClick={() => setFieldValue('showPassword', !values.showPassword)}
                            className="absolute top-3.5 right-3 text-gray-400 focus:outline-none"
                          >
                            {values.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <PasswordStrengthIndicator password={values.password} />

                        <div className="relative mt-4">
                          <Field
                            as="select"
                            name="role"
                            className="pl-10 pr-4 py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                          >
                            <option value="doctor">{t('Doctor')}</option>
                            <option value="lab_technician">{t('Lab Technician')}</option>
                            <option value="admin">{t('Admin')}</option>
                          </Field>
                          <UserCheck className="absolute top-3.5 left-3 text-gray-400" size={20} />
                          <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div className="flex items-center mt-4">
                      <Field
                        type="checkbox"
                        name="termsAccepted"
                        className="mr-2 rounded focus:ring-cyan-500 h-4 w-4 text-cyan-600 transition duration-150 ease-in-out"
                      />
                      <label htmlFor="termsAccepted" className="text-sm text-gray-600">
                        I accept the <a href="/terms" className="text-cyan-600 hover:underline">terms and conditions</a>
                      </label>
                    </div>
                    <ErrorMessage name="termsAccepted" component="div" className="text-red-500 text-sm mt-1" />

                    <div className="flex space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-1/2 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out"
                      >
                        {t('Back')}
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-600'
                        }`}
                      >
                        {isSubmitting ? t('Submitting...') : t('Submit')}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.api && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
                  role="alert"
                >
                  <span className="block sm:inline">{errors.api}</span>
                </motion.div>
              )}
            </Form>
          )}
        </Formik>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <p className="text-center text-sm text-gray-600 mb-4">{t('Or sign up with')}</p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-600 text-white p-2 rounded-full"
            >
              <Facebook size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-400 text-white p-2 rounded-full"
            >
              <Twitter size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-500 text-white p-2 rounded-full"
            >
              <GoogleIcon size={24} />
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 mt-6"
        >
          Already have an account?{' '}
          <Link to="/Login" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-300">
            Log in here
          </Link>
        </motion.p>
      </div>
    </motion.div>
  </div>
</div>
);
};

export default Register;

                       