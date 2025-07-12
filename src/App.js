import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { store } from './store';
import theme from './styles/theme';
import i18n from './i18n';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard'; 
import DiagnosisPage from './components/Dashboard/DiagnosisPage'; // ✅ Add this import
import RegistrationSuccess from './components/RegistrationSuccess';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import MFASetup from './components/MFASetup';
import EmailVerificationSuccess from './components/EmailVerificationSuccess';
import MFAVerify from './components/MFAVerify';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/registration-success" element={<RegistrationSuccess />} />
                  <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
                  <Route path="/mfa-setup" element={<MFASetup />} />
                  <Route path="/mfa-verify" element={<MFAVerify />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* ✅ Add the diagnosis route as a top-level protected route */}
                  <Route 
                    path="/diagnosis/:visitId" 
                    element={
                      <ProtectedRoute>
                        <DiagnosisPage />
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                   path="/dashboard/*" 
                   element={
                  <ProtectedRoute>
                  <Dashboard />
                  </ProtectedRoute>
                   } 
                  />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;