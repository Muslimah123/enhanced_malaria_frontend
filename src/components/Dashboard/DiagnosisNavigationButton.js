// src/components/Dashboard/DiagnosisNavigationButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, FileText, ExternalLink } from 'lucide-react';

const DiagnosisNavigationButton = ({ 
  visitId, 
  variant = 'primary', // 'primary', 'secondary', 'outline'
  size = 'medium', // 'small', 'medium', 'large'
  showIcon = true,
  children
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/diagnosis/${visitId}`);
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-white shadow-sm hover:shadow-md'
  };

  // Size styles
  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  // Icon size based on button size
  const iconSize = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {showIcon && (
        <Activity 
          size={iconSize[size]} 
          className="mr-2" 
        />
      )}
      {children || 'View Diagnosis'}
    </button>
  );
};

// Specialized components for common use cases
export const ViewDiagnosisButton = ({ visitId, ...props }) => (
  <DiagnosisNavigationButton visitId={visitId} {...props}>
    View Diagnosis Report
  </DiagnosisNavigationButton>
);

export const DiagnosisLinkButton = ({ visitId, ...props }) => (
  <DiagnosisNavigationButton 
    visitId={visitId} 
    variant="outline" 
    showIcon={true}
    {...props}
  >
    <FileText size={16} className="mr-2" />
    Open Report
    <ExternalLink size={14} className="ml-2" />
  </DiagnosisNavigationButton>
);

export const QuickDiagnosisButton = ({ visitId, ...props }) => (
  <DiagnosisNavigationButton 
    visitId={visitId} 
    size="small"
    variant="secondary"
    {...props}
  >
    Diagnosis
  </DiagnosisNavigationButton>
);

export default DiagnosisNavigationButton;