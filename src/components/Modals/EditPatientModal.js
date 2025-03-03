import React, { useState, useEffect } from 'react';
import { getPatient, updatePatient } from '../../services/api';

const EditPatientModal = ({ isOpen, onClose, patient, onEditComplete }) => {
  const [editedPatient, setEditedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (patient && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getPatient(patient.patient_id);
          setEditedPatient(data);
        } catch (error) {
          console.error('Error fetching patient:', error);
          setError('Failed to fetch patient data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatient();
  }, [patient, isOpen]);

  const handleChange = (e) => {
    setEditedPatient({ ...editedPatient, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   setError(null);
  //   setSuccessMessage(null);
  //   try {
  //     const updatedPatient = await updatePatient(editedPatient.patient_id, editedPatient);
  //     setSuccessMessage('Patient updated successfully!');
  //     onEditComplete(updatedPatient);
  //     setTimeout(() => {
  //       setSuccessMessage(null);
  //       onClose();
  //     }, 5000); // Close the modal after 2 seconds
  //   } catch (error) {
  //     console.error('Update failed:', error);
  //     setError('Failed to update patient. Please try again.');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('Sending data:', editedPatient);
      const updatedPatient = await updatePatient(editedPatient.patient_id, editedPatient);
      console.log('Received updated patient:', updatedPatient);
      setSuccessMessage('Patient updated successfully!');
      onEditComplete(updatedPatient);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Update failed:', error);
      setError('Failed to update patient. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  const handleCloseError = () => {
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Patient</h2>
        {isLoading ? (
          <p>Loading patient data...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleCloseError}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        ) : successMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editedPatient.name}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedPatient.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={editedPatient.age}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={editedPatient.gender}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={editedPatient.address}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPatientModal;