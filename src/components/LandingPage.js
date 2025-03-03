import React, { useState } from 'react';
import { ArrowRight, Activity, Clock, Check, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigationItems = [
    { href: "#features", text: "Features" },
    { href: "#how-it-works", text: "How It Works" },
    { href: "#testimonials", text: "Testimonials" },
  ];

  const features = [
    { icon: <Activity size={40} />, title: "Accurate Results", description: "Our AI model is trained on vast datasets, ensuring high accuracy in malaria detection." },
    { icon: <Clock size={40} />, title: "Rapid Diagnosis", description: "Get results in minutes, not hours or days, enabling faster treatment decisions." },
    { icon: <Check size={40} />, title: "Easy to Use", description: "User-friendly interface designed for healthcare professionals of all technical levels." },
  ];

  const steps = [
    { number: 1, text: "Upload blood sample image" },
    { number: 2, text: "AI analyzes the sample" },
    { number: 3, text: "Receive diagnosis report" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-400 to-cyan-300 text-white'} overflow-x-hidden`}>
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} items={navigationItems} darkMode={darkMode} setDarkMode={setDarkMode} />
      <HeroSection />
      <FeaturesSection features={features} />
      <HowItWorksSection steps={steps} />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

const Navigation = ({ isMenuOpen, setIsMenuOpen, items, darkMode, setDarkMode }) => (
  <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-2xl font-bold"
    >
      MalariaAI
    </motion.div>
    <div className="flex items-center space-x-4">
      <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          <ChevronDown className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`md:flex space-x-4 ${isMenuOpen ? 'block absolute top-16 right-4 bg-white text-gray-800 p-4 rounded shadow-lg' : 'hidden'} md:relative md:top-0 md:right-0 md:bg-transparent md:text-white md:p-0 md:shadow-none`}
      >
        {items.map((item, index) => (
          <a key={index} href={item.href} className="block py-2 hover:text-pink-300 transition duration-300">{item.text}</a>
        ))}
      </motion.div>
    </div>
  </nav>
);

const HeroSection = () => (
  <header className="container mx-auto px-4 py-16 text-center">
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="text-5xl md:text-6xl font-bold mb-6"
    >
      Automated Malaria Diagnosis
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="text-xl md:text-2xl mb-8"
    >
      Experience the future of malaria diagnosis. Our AI-powered system provides quick and accurate results.
    </motion.p>
    <Link to="/register">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out flex items-center mx-auto"
      >
        Get Started
        <ArrowRight className="ml-2" />
      </motion.button>
    </Link>
  </header>
);

const FeaturesSection = ({ features }) => (
  <section id="features" className="container mx-auto px-4 py-16">
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Our System?</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  </section>
);

const HowItWorksSection = ({ steps }) => (
  <section id="how-it-works" className="bg-white text-gray-800 py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-around items-center">
        {steps.map((step, index) => (
          <Step key={index} {...step} />
        ))}
      </div>
    </div>
  </section>
);

const TestimonialSection = () => (
  <section id="testimonials" className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by Healthcare Professionals</h2>
    <motion.blockquote
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-xl md:text-2xl italic"
    >
      "This system has revolutionized how we diagnose malaria. It's fast, accurate, and incredibly easy to use."
    </motion.blockquote>
    <p className="mt-6 font-bold">Dr. Carine Mukamakuza, Professor at CMU Africa</p>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8 text-center">
    <p>&copy; 2024 Malaria Diagnosis System. All rights reserved.</p>
  </footer>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white text-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-300"
  >
    <div className="text-pink-500 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const Step = ({ number, text }) => (
  <motion.div
    initial={{ opacity: 0, x: number % 2 === 0 ? 50 : -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="flex flex-col items-center mb-8 md:mb-0"
  >
    <div className="bg-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">
      {number}
    </div>
    <p className="text-center font-semibold">{text}</p>
  </motion.div>
);

export default LandingPage;
