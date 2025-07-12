// src/components/DiagnosisProgressIndicator.js
import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader, AlertCircle, Microscope, BarChart2, Activity, Clock } from 'lucide-react';

/**
 * Shows the progress of the diagnosis process with multiple stages
 */
const DiagnosisProgressIndicator = ({ 
  status = 'idle', // idle, running, complete, error
  progress = 0,     // 0-100
  onComplete        // callback when complete
}) => {
  const [stage, setStage] = useState(0);
  
  // Define the stages of diagnosis
  const stages = [
    {
      id: 'initializing',
      label: 'Initializing Analysis',
      description: 'Setting up the analysis environment',
      icon: Clock,
      progressRange: [0, 10]
    },
    {
      id: 'detecting',
      label: 'Detecting Parasites',
      description: 'Scanning images for malaria parasites',
      icon: Microscope,
      progressRange: [10, 40]
    },
    {
      id: 'analyzing',
      label: 'Analyzing Blood Cells',
      description: 'Counting and analyzing white blood cells',
      icon: Activity, 
      progressRange: [40, 70]
    },
    {
      id: 'calculating',
      label: 'Calculating Density',
      description: 'Determining parasite density and severity',
      icon: BarChart2,
      progressRange: [70, 90]
    },
    {
      id: 'finalizing',
      label: 'Finalizing Results',
      description: 'Compiling the diagnosis report',
      icon: CheckCircle,
      progressRange: [90, 100] 
    }
  ];
  
  // Update current stage based on progress
  useEffect(() => {
    if (status === 'running') {
      const currentStage = stages.findIndex(s => 
        progress >= s.progressRange[0] && progress <= s.progressRange[1]
      );
      if (currentStage !== -1) {
        setStage(currentStage);
      }
    } else if (status === 'complete') {
      setStage(stages.length - 1);
      if (onComplete) onComplete();
    }
  }, [progress, status, onComplete]);
  
  // Calculate stage-specific progress (0-100 within the current stage)
  const getStageProgress = () => {
    if (status !== 'running') return 0;
    
    const currentStageInfo = stages[stage];
    if (!currentStageInfo) return 0;
    
    const [min, max] = currentStageInfo.progressRange;
    const range = max - min;
    return Math.min(100, Math.max(0, ((progress - min) / range) * 100));
  };

  if (status === 'idle') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-3 mb-3">
            <Microscope className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Begin Diagnosis</h3>
          <p className="text-gray-600 mb-4">
            Click the button below to start analyzing the blood samples
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 rounded-full p-3 mb-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Diagnosis Error</h3>
          <p className="text-red-600 mb-4">
            There was an error processing the diagnosis. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Overall progress indicator */}
      <div className="w-full h-2 bg-gray-200">
        <div 
          className="h-2 bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-6">
        {/* Title and overall status */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {status === 'complete' ? 'Diagnosis Complete' : 'Processing Diagnosis'}
          </h3>
          <p className="text-gray-600">
            {status === 'complete' 
              ? 'All processing steps completed successfully' 
              : `${Math.round(progress)}% complete`
            }
          </p>
        </div>
        
        {/* Stages progress */}
        <div className="space-y-6">
          {stages.map((stageInfo, index) => {
            const StageIcon = stageInfo.icon;
            const isActive = index === stage && status === 'running';
            const isComplete = 
              (status === 'complete') || 
              (status === 'running' && index < stage);
            const isPending = !isActive && !isComplete;
            
            return (
              <div 
                key={stageInfo.id} 
                className={`flex items-start ${
                  isActive ? 'opacity-100' : 
                  isComplete ? 'opacity-100' : 
                  'opacity-50'
                }`}
              >
                {/* Stage icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-100 text-blue-600 animate-pulse' :
                  isComplete ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isActive ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : isComplete ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StageIcon className="h-5 w-5" />
                  )}
                </div>
                
                {/* Stage details */}
                <div className="ml-4 flex-1">
                  <h4 className={`text-sm font-medium ${
                    isActive ? 'text-blue-800' :
                    isComplete ? 'text-green-800' :
                    'text-gray-500'
                  }`}>
                    {stageInfo.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {stageInfo.description}
                  </p>
                  
                  {/* Stage-specific progress bar (only for active stage) */}
                  {isActive && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${getStageProgress()}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisProgressIndicator;