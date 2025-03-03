import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, FileText, User, Image, Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { getVisitDetails } from '../../services/api';

const VisitDetailsModal = ({ isOpen, onClose, visitId }) => {
  const [visitDetails, setVisitDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && visitId) {
      fetchVisitDetails();
    }
  }, [isOpen, visitId]);

  const fetchVisitDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getVisitDetails(visitId);
      setVisitDetails(details);
    } catch (error) {
      setError('Failed to fetch visit details. Please try again.');
      console.error('Error fetching visit details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'awaiting images': return <Clock className="text-yellow-500" />;
      case 'awaiting diagnosis': return <AlertCircle className="text-blue-500" />;
      case 'diagnosed': return <CheckCircle className="text-green-500" />;
      default: return <Circle className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Visit Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-300">
            <X size={24} />
          </button>
        </div>
        
        {isLoading ? (
          <p className="text-center py-4">Loading visit details...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : visitDetails ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="text-blue-500" />
                <h3 className="text-lg font-semibold">Patient Information</h3>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(visitDetails.status)}
                <span className="text-sm font-medium">{visitDetails.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Name:</strong> {visitDetails.patient_name}</p>
              <p><strong>ID:</strong> {visitDetails.patient_id}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="text-green-500" />
              <h3 className="text-lg font-semibold">Visit Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Date:</strong> {new Date(visitDetails.visit_date).toLocaleString()}</p>
              <p><strong>Reason:</strong> {visitDetails.reason || 'Not specified'}</p>
              <p><strong>Symptoms:</strong> {visitDetails.symptoms || 'None reported'}</p>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="text-yellow-500" />
              <h3 className="text-lg font-semibold">Visit Details</h3>
            </div>
            <p><strong>Notes:</strong> {visitDetails.notes || 'No notes'}</p>

            <div className="flex items-center space-x-2">
              <Image className="text-purple-500" />
              <h3 className="text-lg font-semibold">Images</h3>
            </div>
            {visitDetails.images && visitDetails.images.length > 0 ? (
              <div>
                <p>{visitDetails.images.length} image(s) uploaded</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {visitDetails.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Visit image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <p>No images uploaded</p>
            )}
          </div>
        ) : (
          <p className="text-center py-4">No visit details available</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VisitDetailsModal;