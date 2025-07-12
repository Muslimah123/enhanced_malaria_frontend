// import React, { useState, useEffect } from 'react';
// import { 
//   Activity, 
//   CheckCircle, 
//   Microscope, 
//   Loader, 
//   FileText, 
//   BarChart, 
//   AlertCircle 
// } from 'lucide-react';
// import { initiateDiagnosis } from '../../services/api';

// // Steps in the diagnosis process
// const DIAGNOSIS_STEPS = [
//   { id: 'initializing', label: 'Initializing', icon: Activity, color: 'bg-blue-500' },
//   { id: 'imaging', label: 'Processing Images', icon: Microscope, color: 'bg-indigo-500' },
//   { id: 'analyzing', label: 'Analyzing Cells', icon: Loader, color: 'bg-purple-500' },
//   { id: 'detecting', label: 'Detecting Parasites', icon: BarChart, color: 'bg-pink-500' },
//   { id: 'reporting', label: 'Generating Report', icon: FileText, color: 'bg-red-500' },
// ];

// const EnhancedInitiateDiagnosisButton = ({ visitId, onComplete }) => {
//   const [status, setStatus] = useState('idle'); // idle, processing, success, error
//   const [currentStep, setCurrentStep] = useState(0);
//   const [expanded, setExpanded] = useState(false);
//   const [error, setError] = useState(null);

//   // Simulate progress through the steps
//   useEffect(() => {
//     let timer;
    
//     if (status === 'processing' && currentStep < DIAGNOSIS_STEPS.length - 1) {
//       // Add random time between steps to simulate real processing
//       const stepTime = 1000 + Math.random() * 1500;
      
//       timer = setTimeout(() => {
//         setCurrentStep(prev => prev + 1);
//       }, stepTime);
//     }
    
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [status, currentStep]);

//   const handleClick = async () => {
//     // Check for valid visitId before proceeding
//     if (!visitId) {
//       setStatus('error');
//       setError('Invalid visit ID. Please reload the page and try again.');
//       return;
//     }

//     setStatus('processing');
//     setCurrentStep(0);
//     setExpanded(true);
//     setError(null);
    
//     try {
//       console.log('Initiating diagnosis for visit ID:', visitId);
      
//       // Call the API to initiate diagnosis
//       const result = await initiateDiagnosis(visitId);
//       console.log('Diagnosis result:', result);
      
//       // Ensure we show all steps (at least briefly)
//       setCurrentStep(DIAGNOSIS_STEPS.length - 1);
      
//       // Small delay before showing success
//       setTimeout(() => {
//         setStatus('success');
        
//         // If there's a callback, call it with the result
//         if (onComplete) {
//           onComplete(result);
//         }
//       }, 1000);
      
//     } catch (error) {
//       console.error('Error initiating diagnosis:', error);
//       setStatus('error');
//       setError(error.response?.data?.error || error.message || 'An error occurred during diagnosis');
//     }
//   };

//   const toggleExpanded = () => {
//     if (status !== 'idle') {
//       setExpanded(!expanded);
//     }
//   };
  
//   const getButtonText = () => {
//     switch (status) {
//       case 'processing': return 'Processing...';
//       case 'success': return 'Diagnosis Complete';
//       case 'error': return 'Diagnosis Failed';
//       default: return 'Initiate Diagnosis';
//     }
//   };

//   const getStatusIcon = () => {
//     switch (status) {
//       case 'processing':
//         return <Activity size={20} className="animate-spin mr-2" />;
//       case 'success':
//         return <CheckCircle size={20} className="mr-2 text-green-500" />;
//       case 'error':
//         return <AlertCircle size={20} className="mr-2 text-red-500" />;
//       default:
//         return <Activity size={20} className="mr-2" />;
//     }
//   };

//   return (
//     <div className="max-w-md">
//       <button 
//         className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center
//           ${status === 'success' 
//             ? 'bg-green-500 hover:bg-green-600' 
//             : status === 'error'
//               ? 'bg-red-500 hover:bg-red-600'
//               : 'bg-blue-500 hover:bg-blue-600'} 
//           text-white shadow-sm transition-colors
//           ${status === 'processing' ? 'cursor-wait' : status === 'idle' ? 'cursor-pointer' : ''}
//           disabled:opacity-50 disabled:cursor-not-allowed`}
//         onClick={status === 'idle' ? handleClick : toggleExpanded}
//         disabled={status === 'processing' && !expanded}
//       >
//         {getStatusIcon()}
//         <span>{getButtonText()}</span>
        
//         {status === 'processing' && !expanded && (
//           <div className="ml-2 flex items-center">
//             <div className="w-4 h-4 relative">
//               <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-full"></div>
//               <div 
//                 className="absolute inset-0 border-2 border-l-transparent border-white rounded-full animate-spin"
//               ></div>
//             </div>
//           </div>
//         )}
//       </button>
      
//       {/* Progress steps panel */}
//       {expanded && status !== 'idle' && (
//         <div className="mt-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//           <div className="p-4">
//             <div className="space-y-4">
//               {DIAGNOSIS_STEPS.map((step, index) => {
//                 const StepIcon = step.icon;
//                 const isActive = currentStep >= index;
//                 const isCurrent = currentStep === index;
                
//                 return (
//                   <div 
//                     key={step.id}
//                     className={`flex items-center p-2 rounded-lg transition-colors ${
//                       isCurrent ? 'bg-blue-50 border border-blue-100' : ''
//                     }`}
//                   >
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
//                       ${isActive ? step.color : 'bg-gray-200'} 
//                       ${isCurrent && status === 'processing' ? 'animate-pulse' : ''}`}
//                     >
//                       <StepIcon size={16} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <p className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
//                         {step.label}
//                       </p>
//                     </div>
//                     <div className="ml-2">
//                       {isActive && index < currentStep && (
//                         <CheckCircle size={16} className="text-green-500" />
//                       )}
//                       {isCurrent && status === 'processing' && (
//                         <div className="w-4 h-4 relative">
//                           <div className="absolute inset-0 border-2 border-blue-200 border-opacity-50 rounded-full"></div>
//                           <div 
//                             className="absolute inset-0 border-2 border-l-transparent border-blue-500 rounded-full animate-spin"
//                           ></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {/* Error message */}
//             {status === 'error' && error && (
//               <div className="mt-3 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
//                 <div className="flex items-start">
//                   <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
//                   <p>{error}</p>
//                 </div>
//               </div>
//             )}
            
//             {/* Success message */}
//             {status === 'success' && (
//               <div className="mt-3 p-3 bg-green-50 rounded-lg text-green-700 text-sm">
//                 <div className="flex items-start">
//                   <CheckCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium">Diagnosis completed successfully</p>
//                     <p className="mt-1">Your report is now ready to view.</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnhancedInitiateDiagnosisButton;
// import React, { useState } from 'react';
// import { Activity, CheckCircle } from 'lucide-react';
// import DiagnosisProgressIndicator from '../DiagnosisProgressIndicator';

// const EnhancedInitiateDiagnosisButton = ({ onInitiate }) => {
//   const [status, setStatus] = useState('idle'); // idle, initiating, processing, success
//   const [progress, setProgress] = useState(0);

//   const handleClick = async () => {
//     setStatus('initiating');
//     setProgress(0);
//     try {
//       await onInitiate(updateProgress);
//       setStatus('success');
//     } catch (error) {
//       setStatus('idle');
//       console.error('Error initiating diagnosis:', error);
//     }
//   };

//   const updateProgress = (newProgress) => {
//     setProgress(newProgress);
//     if (newProgress > 0 && status !== 'processing') {
//       setStatus('processing');
//     }
//   };

//   const getButtonText = () => {
//     switch (status) {
//       case 'initiating': return 'Initiating...';
//       case 'processing': return `Processing ${progress}%`;
//       case 'success': return 'Diagnosis Initiated';
//       default: return 'Initiate Diagnosis';
//     }
//   };

//   return (
//     <button 
//       className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center w-48 
//         ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
//       onClick={handleClick}
//       disabled={status !== 'idle'}
//     >
//       {status === 'success' ? (
//         <CheckCircle size={20} className="mr-2" />
//       ) : (
//         <Activity size={20} className={`mr-2 ${status !== 'idle' ? 'animate-spin' : ''}`} />
//       )}
//       {getButtonText()}
//     </button>
//   );
// };

// export default EnhancedInitiateDiagnosisButton;
import React, { useState } from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import DiagnosisProgressIndicator from '../DiagnosisProgressIndicator';

const EnhancedInitiateDiagnosisButton = ({ onInitiate }) => {
  const [status, setStatus] = useState('idle'); 
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

  // Convert status to format expected by DiagnosisProgressIndicator
  const getProgressStatus = () => {
    if (status === 'idle') return 'idle';
    if (status === 'success') return 'complete';
    if (status === 'initiating' || status === 'processing') return 'running';
    return 'idle';
  };

  // If we're in an active state, show the full progress indicator
  if (status !== 'idle') {
    return (
      <div className="w-full">
        <DiagnosisProgressIndicator 
          status={getProgressStatus()}
          progress={progress}
          onComplete={() => {
            if (status === 'success') {
              // Allow time for the user to see the "complete" state
              setTimeout(() => setStatus('idle'), 3000);
            }
          }}
        />
        
        {/* Show a cancel button to allow the user to reset if needed */}
        {status !== 'success' && (
          <div className="text-center mt-4">
            <button
              onClick={() => setStatus('idle')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default button when idle
  return (
    <button 
      className="px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center w-48 bg-blue-500 text-white"
      onClick={handleClick}
    >
      <Activity size={20} className="mr-2" />
      {getButtonText()}
    </button>
  );
};

export default EnhancedInitiateDiagnosisButton;