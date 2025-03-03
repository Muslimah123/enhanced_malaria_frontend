import React, { useState } from 'react';
import { Activity, CheckCircle } from 'lucide-react';

const EnhancedInitiateDiagnosisButton = ({ onInitiate }) => {
  const [status, setStatus] = useState('idle'); // idle, initiating, processing, success
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    setStatus('initiating');
    setProgress(0);
    try {
      await onInitiate(updateProgress);
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      console.error('Error initiating diagnosis:', error);
    }
  };

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
    if (newProgress > 0 && status !== 'processing') {
      setStatus('processing');
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'initiating': return 'Initiating...';
      case 'processing': return `Processing ${progress}%`;
      case 'success': return 'Diagnosis Initiated';
      default: return 'Initiate Diagnosis';
    }
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center w-48 
        ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
      onClick={handleClick}
      disabled={status !== 'idle'}
    >
      {status === 'success' ? (
        <CheckCircle size={20} className="mr-2" />
      ) : (
        <Activity size={20} className={`mr-2 ${status !== 'idle' ? 'animate-spin' : ''}`} />
      )}
      {getButtonText()}
    </button>
  );
};

export default EnhancedInitiateDiagnosisButton;