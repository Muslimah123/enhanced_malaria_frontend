import React, { useState } from 'react';
import { deletePatient } from '../../services/api';

const DeletePatientModal = ({ isOpen, onClose, patientId, patientName, onDeleteComplete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePatient(patientId);
      alert('Patient deleted successfully');
      onDeleteComplete();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete patient. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Delete Patient</h2>
        <p className="mb-4">Are you sure you want to delete {patientName}? This action cannot be undone.</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatientModal;