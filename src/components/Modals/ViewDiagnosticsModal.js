
// export default ViewDiagnosticsModal;
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { getVisitDiagnosis } from '../../services/api';

const ViewDiagnosticsModal = ({ isOpen, onClose, visitId }) => {
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && visitId) {
      fetchDiagnosisResult();
    }
  }, [isOpen, visitId]);

  const fetchDiagnosisResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getVisitDiagnosis(visitId);
      setDiagnosisResult(result);
    } catch (err) {
      console.error('Error fetching diagnosis result:', err);
      setError('Failed to fetch diagnosis result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagnosis Results</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <p>Loading diagnosis results...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : diagnosisResult ? (
          <div>
            <p className="font-semibold">Status: 
              <span className={diagnosisResult.status === 'positive' ? 'text-red-500' : 'text-green-500'}>
                {diagnosisResult.status === 'positive' ? 
                  <AlertCircle className="inline ml-2" /> : 
                  <CheckCircle className="inline ml-2" />
                }
                {diagnosisResult.status}
              </span>
            </p>
            <p>Parasite: {diagnosisResult.parasite_name}</p>
            <p>Count: {diagnosisResult.count}</p>
            <p>Confidence: {(diagnosisResult.average_confidence * 100).toFixed(2)}%</p>
            <p>Severity: {diagnosisResult.severity_level}</p>
          </div>
        ) : (
          <p>No diagnosis results available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewDiagnosticsModal;