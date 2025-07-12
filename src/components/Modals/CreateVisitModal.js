import React, { useState, useEffect } from 'react';
import { createVisit } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, FileText, CheckCircle, AlertCircle, Loader, 
  User, Clock, Clipboard, Thermometer, ClipboardList, 
  CalendarPlus, AlertTriangle, UserCheck
} from 'lucide-react';

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
              className="inline-block w-full max-w-md overflow-hidden text-left align-middle bg-white shadow-xl rounded-xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                    <CalendarPlus className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Create New Visit</h3>
                </div>
              </div>

              {/* Patient Info Section */}
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">PATIENT INFORMATION</p>
                    <p className="text-gray-800 font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">ID: {patient.patient_id}</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 bg-green-50 border-l-4 border-green-500"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-green-800 font-medium">Success</h4>
                        <p className="text-green-700 text-sm">{successMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 bg-red-50 border-l-4 border-red-500"
                  >
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-800 font-medium">Error</h4>
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Content */}
              <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reason">
                      <div className="flex items-center">
                        <Clipboard className="mr-2 text-blue-600" size={16} />
                        Reason for Visit
                      </div>
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={visitData.reason}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Enter the primary reason for the patient's visit..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="symptoms">
                      <div className="flex items-center">
                        <Thermometer className="mr-2 text-blue-600" size={16} />
                        Symptoms
                      </div>
                    </label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={visitData.symptoms}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Describe any symptoms the patient is experiencing..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                      <div className="flex items-center">
                        <ClipboardList className="mr-2 text-blue-600" size={16} />
                        Clinical Notes
                      </div>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={visitData.notes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={4}
                      placeholder="Add any additional clinical notes or observations..."
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="mr-1.5" size={14} />
                      {new Date().toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="animate-spin mr-2" size={16} />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CalendarPlus className="mr-2" size={16} />
                            Create Visit
                          </>
                        )}
                      </button>
                    </div>
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