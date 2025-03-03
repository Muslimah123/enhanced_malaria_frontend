import React, { useState, useEffect } from 'react';
import { getPatientVisits, getVisitDetails, uploadImages } from '../services/api';

const PatientVisitHistoryModal = ({ isOpen, onClose, patientId }) => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchVisits();
    }
  }, [isOpen, patientId]);

  const fetchVisits = async () => {
    try {
      const visitsData = await getPatientVisits(patientId);
      setVisits(visitsData);
    } catch (error) {
      console.error('Error fetching patient visits:', error);
    }
  };

  const handleVisitClick = async (visitId) => {
    try {
      const visitDetails = await getVisitDetails(visitId);
      setSelectedVisit(visitDetails);
    } catch (error) {
      console.error('Error fetching visit details:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      alert('You can only upload up to 5 images at a time.');
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
      formData.append('smear_type', 'thick'); // You might want to let the user choose these
      formData.append('test_type', 'Giemsa'); // You might want to let the user choose these
    });

    setIsUploading(true);
    try {
      await uploadImages(patientId, selectedVisit.visit_id, formData);
      alert('Images uploaded successfully');
      const updatedVisitDetails = await getVisitDetails(selectedVisit.visit_id);
      setSelectedVisit(updatedVisitDetails);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Patient Visit History</h2>
        <div className="flex">
          <div className="w-1/3 pr-4 border-r">
            <h3 className="text-xl font-semibold mb-2">Visits</h3>
            {visits.map((visit) => (
              <div
                key={visit.visit_id}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleVisitClick(visit.visit_id)}
              >
                <p>Date: {new Date(visit.visit_date).toLocaleDateString()}</p>
                <p>Status: {visit.diagnosis_status}</p>
              </div>
            ))}
          </div>
          <div className="w-2/3 pl-4">
            {selectedVisit ? (
              <>
                <h3 className="text-xl font-semibold mb-2">Visit Details</h3>
                <p>Date: {new Date(selectedVisit.visit_date).toLocaleDateString()}</p>
                <h4 className="text-lg font-semibold mt-4 mb-2">Images</h4>
                {selectedVisit.images.map((image) => (
                  <div key={image.image_id} className="mb-2">
                    <p>Smear Type: {image.smear_type}</p>
                    <p>Test Type: {image.test_type}</p>
                    <p>Status: {image.status}</p>
                  </div>
                ))}
                <h4 className="text-lg font-semibold mt-4 mb-2">Diagnosis Results</h4>
                {selectedVisit.diagnosis_results.map((result) => (
                  <div key={result.result_id} className="mb-2">
                    <p>Parasite: {result.parasite_name}</p>
                    <p>Count: {result.count}</p>
                    <p>Severity: {result.severity_level}</p>
                    <p>Status: {result.status}</p>
                  </div>
                ))}
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="mt-4"
                />
              </>
            ) : (
              <p>Select a visit to see details</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientVisitHistoryModal;