import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          appName: 'MalariaAI',
          heroTitle: 'Automated Malaria Diagnosis',
          heroSubtitle: 'Experience the future of malaria diagnosis. Our AI-powered system provides quick and accurate results.',
          getStarted: 'Get Started',
          features: 'Features',
          howItWorks: 'How It Works',
          testimonials: 'Testimonials',
          whyChooseUs: 'Why Choose Our System?',
          accurateResults: 'Accurate Results',
          accurateResultsDesc: 'Our AI model is trained on vast datasets, ensuring high accuracy in malaria detection.',
          rapidDiagnosis: 'Rapid Diagnosis',
          rapidDiagnosisDesc: 'Get results in minutes, not hours or days, enabling faster treatment decisions.',
          easyToUse: 'Easy to Use',
          easyToUseDesc: 'User-friendly interface designed for healthcare professionals of all technical levels.',
          step1: 'Upload blood sample image',
          step2: 'AI analyzes the sample',
          step3: 'Receive diagnosis report',
          testimonialQuote: "This system has revolutionized how we diagnose malaria. It's fast, accurate, and incredibly easy to use.",
          testimonialAuthor: "Dr. Jane Smith, Tropical Disease Specialist",
          footerText: '© 2024 Malaria Diagnosis System. All rights reserved.',
        }
      },
      // Add more languages here
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;