import React, { useState, useEffect } from 'react';
import { createVisit } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const CreateVisitModal = ({ isOpen, onClose, patient, onVisitCreated }) => {
  const [visitData, setVisitData] = useState({
    reason: '',
    symptoms: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form state when modal is opened or patient changes
  useEffect(() => {
    if (isOpen) {
      setVisitData({
        reason: '',
        symptoms: '',
        notes: ''
      });
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen, patient]);

  const handleChange = (e) => {
    setVisitData({ ...visitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const newVisit = await createVisit(patient.patient_id, visitData);
      setSuccessMessage(`Visit created successfully for patient ${patient.name} (ID: ${patient.patient_id})`);
      onVisitCreated(newVisit);
      // Reset form after successful submission
      setVisitData({
        reason: '',
        symptoms: '',
        notes: ''
      });
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating visit:', error);
      setErrorMessage('Failed to create visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setVisitData({
      reason: '',
      symptoms: '',
      notes: ''
    });
    setSuccessMessage('');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center flex items-center">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl"
            >
              <div className="relative">
                <button 
                  onClick={handleClose} 
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Visit</h3>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    {successMessage}
                  </motion.div>
                )}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center"
                  >
                    <AlertCircle className="mr-2" size={18} />
                    {errorMessage}
                  </motion.div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientName">
                      Patient
                    </label>
                    <input
                      id="patientName"
                      type="text"
                      value={patient.name}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                      <FileText className="inline mr-2" size={18} />
                      Reason for visit
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={visitData.reason}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symptoms">
                      <FileText className="inline mr-2" size={18} />
                      Symptoms
                    </label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={visitData.symptoms}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                      <FileText className="inline mr-2" size={18} />
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={visitData.notes}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin mr-2" size={18} />
                          Creating...
                        </>
                      ) : (
                        'Create Visit'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateVisitModal;