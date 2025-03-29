
// import React, { useState, useEffect } from 'react';
// import { getVisitDetails, getDiagnosisResults, downloadVisitReport } from '../../services/api';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Download, User, Calendar, Activity, ClipboardList, FileText, AlertTriangle, CheckCircle, X, Thermometer, Clipboard, ChevronDown, ChevronUp } from 'lucide-react';

// const DiagnosisModal = ({ isOpen, onClose, visitId }) => {
//   const [visitData, setVisitData] = useState(null);
//   const [diagnosisResult, setDiagnosisResult] = useState(null);
//   const [imageDiagnoses, setImageDiagnoses] = useState([]);
//   const [treatmentPlan, setTreatmentPlan] = useState("");
//   const [nextSteps, setNextSteps] = useState("");
//   const [activeTab, setActiveTab] = useState("diagnosis");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showImageDetails, setShowImageDetails] = useState(false);

//   // Existing useEffect and other logic remain unchanged
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!visitId) return;
//       setLoading(true);
//       setError(null);
//       try {
//         console.log("Fetching visit details for visitId:", visitId);
//         const visitDetails = await getVisitDetails(visitId);
//         console.log("Received visit details:", visitDetails);
//         setVisitData(visitDetails);

//         console.log("Fetching diagnosis results for visitId:", visitId);
//         const diagnosisResults = await getDiagnosisResults(visitId);
//         console.log("Received diagnosis results:", diagnosisResults);
//         setDiagnosisResult(diagnosisResults.overall_diagnosis);
//         setImageDiagnoses(diagnosisResults.image_diagnoses);
//       } catch (err) {
//         console.error('Error fetching diagnosis data:', err);
//         setError('Failed to load diagnosis data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isOpen) {
//       fetchData();
//     }
//   }, [visitId, isOpen]);

//   const handleDownloadReport = async () => {
//     try {
//       const blob = await downloadVisitReport(visitId);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${visitData.patient_name}_visit_report_${visitId}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       alert('Failed to download report. Please try again.');
//     }
//   };

//   const renderSeverityAlert = () => {
//     if (!diagnosisResult || !diagnosisResult.severity_level) return null;

//     const severityConfig = {
//       severe: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, title: 'Severe', description: 'This case requires immediate attention and treatment.' },
//       moderate: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, title: 'Moderate', description: 'Close monitoring and prompt treatment is recommended.' },
//       mild: { color: 'bg-green-100 text-green-800', icon: CheckCircle, title: 'Mild', description: 'Standard treatment protocol is advised.' },
//     };

//     const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
//     const Icon = config.icon;

//     return (
//       <div className={`rounded-lg p-4 ${config.color} shadow-md`}>
//         <div className="flex items-center">
//           <Icon className="h-6 w-6 mr-3" />
//           <div>
//             <h4 className="font-semibold">{config.title}</h4>
//             <p className="text-sm mt-1">{config.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const chartData = diagnosisResult ? [
//     { name: 'Parasite Count', value: diagnosisResult.count },
//     { name: 'Total WBCs', value: diagnosisResult.total_wbcs },
//   ] : [];

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
//         <div className="p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-3xl font-bold text-gray-800">Patient Diagnosis Report</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
//               <X size={28} />
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
//               <p className="font-bold">Error</p>
//               <p>{error}</p>
//             </div>
//           ) : (
//             <>
//               {visitData && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="bg-blue-50 p-6 rounded-xl shadow-md">
//                     <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center">
//                       <User className="mr-3" size={24} /> Patient Information
//                     </h3>
//                     <div className="space-y-2">
//                       <p><span className="font-semibold">Patient ID:</span> {visitData.patient_id}</p>
//                       <p><span className="font-semibold">Name:</span> {visitData.patient_name}</p>
//                       <p><span className="font-semibold">Gender:</span> {visitData.gender}</p>
//                       <p><span className="font-semibold">Age:</span> {visitData.age}</p>
//                       {/* <p><span className="font-semibold">Status:</span> {visitData.status}</p> */}

//                     </div>
//                   </div>
//                   <div className="bg-green-50 p-6 rounded-xl shadow-md">
//                     <h3 className="font-bold text-xl mb-4 text-green-800 flex items-center">
//                       <Calendar className="mr-3" size={24} /> Visit Details
//                     </h3>
//                     <div className="space-y-2">
//                       <p><span className="font-semibold">Visit ID:</span> {visitData.visit_id}</p>
//                       <p><span className="font-semibold">Visit Date:</span> {new Date(visitData.visit_date).toLocaleDateString()}</p>
//                       <p><span className="font-semibold">Reason:</span> {visitData.reason}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="mb-8">
//                 <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
//                   {['diagnosis', 'symptoms', 'treatment', 'next-steps'].map((tab) => (
//                     <button
//                       key={tab}
//                       className={`flex-1 py-2 px-4 rounded-md transition-colors ${
//                         activeTab === tab
//                           ? 'bg-white text-blue-600 shadow-md'
//                           : 'text-gray-600 hover:bg-gray-200'
//                       }`}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="mt-6">
//                   {activeTab === 'diagnosis' && diagnosisResult && (
//                     <div className="space-y-6">
//                       <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
//                         <Activity className="mr-3" size={28} /> Diagnosis Results
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow-md">
//                         <p><span className="font-semibold">Parasite:</span> {diagnosisResult.parasite_name}</p>
//                         <p><span className="font-semibold">Average Confidence:</span> {(diagnosisResult.average_confidence * 100).toFixed(2)}%</p>
//                         <p><span className="font-semibold">Count:</span> {diagnosisResult.count}</p>
//                         <p><span className="font-semibold">Severity Level:</span> {diagnosisResult.severity_level}</p>
//                         <p><span className="font-semibold">Status:</span> {diagnosisResult.status}</p>
//                         <p><span className="font-semibold">Parasite Density:</span> {diagnosisResult.parasite_density.toFixed(2)} parasites/μL</p>
//                         <p><span className="font-semibold">Total WBCs:</span> {diagnosisResult.total_wbcs} cells/μL</p>
//                       </div>
//                       <div className="mt-6">{renderSeverityAlert()}</div>
//                       <div className="h-80 mt-8 bg-white p-4 rounded-xl shadow-md">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <BarChart data={chartData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="value" fill="#60A5FA" />
//                           </BarChart>
//                         </ResponsiveContainer>
//                       </div>
//                       <button
//                         className="mt-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//                         onClick={() => setShowImageDetails(!showImageDetails)}
//                       >
//                         {showImageDetails ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
//                         {showImageDetails ? 'Hide' : 'Show'} Individual Image Results
//                       </button>
//                       {showImageDetails && (
//                         <div className="mt-6 space-y-4">
//                           <h4 className="font-bold text-xl mb-4 text-gray-800">Individual Image Results</h4>
//                           {imageDiagnoses.map((diagnosis, index) => (
//                             <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
//                               <p><span className="font-semibold">Image ID:</span> {diagnosis.image_id}</p>
//                               <p><span className="font-semibold">Parasite Count:</span> {diagnosis.count}</p>
//                               <p><span className="font-semibold">WBC Count:</span> {diagnosis.wbc_count}</p>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {activeTab === 'symptoms' && visitData && (
//                     <div className="space-y-6">
//                       <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
//                         <Thermometer className="mr-3" size={28} /> Symptoms and Notes
//                       </h3>
//                       <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
//                         <h4 className="font-semibold text-lg mb-2 text-yellow-800">Symptoms</h4>
//                         <p>{visitData.symptoms || 'No symptoms recorded'}</p>
//                       </div>
//                       <div className="bg-purple-50 p-6 rounded-xl shadow-md">
//                         <h4 className="font-semibold text-lg mb-2 text-purple-800">Notes</h4>
//                         <p>{visitData.notes || 'No notes recorded'}</p>
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'treatment' && (
//                     <div className="space-y-6">
//                       <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
//                         <ClipboardList className="mr-3" size={28} /> Treatment Plan
//                       </h3>
//                       <textarea
//                         placeholder="Enter treatment plan here..."
//                         value={treatmentPlan}
//                         onChange={(e) => setTreatmentPlan(e.target.value)}
//                         className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
//                         rows={10}
//                       />
//                     </div>
//                   )}

//                   {activeTab === 'next-steps' && (
//                     <div className="space-y-6">
//                       <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
//                         <FileText className="mr-3" size={28} /> Next Steps
//                       </h3>
//                       <textarea
//                         placeholder="Enter next steps here..."
//                         value={nextSteps}
//                         onChange={(e) => setNextSteps(e.target.value)}
//                         className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
//                         rows={10}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <button
//                 onClick={handleDownloadReport}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-md"
//               >
//                 <Download className="mr-3" size={24} /> Download Full Report
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiagnosisModal;

import React, { useState, useEffect } from 'react';
import { getVisitDetails, getDiagnosisResults, downloadVisitReport } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Download, User, Calendar, Activity, ClipboardList, FileText, 
  AlertTriangle, CheckCircle, X, Thermometer, Clipboard, 
  ChevronDown, ChevronUp, Clock, Printer, ArrowLeft,
  ExternalLink, Share2, BarChart2, Shield
} from 'lucide-react';

const DiagnosisModal = ({ isOpen, onClose, visitId }) => {
  const [visitData, setVisitData] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [imageDiagnoses, setImageDiagnoses] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageDetails, setShowImageDetails] = useState(false);

  // Existing useEffect and other logic remain unchanged
  useEffect(() => {
    const fetchData = async () => {
      if (!visitId) return;
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching visit details for visitId:", visitId);
        const visitDetails = await getVisitDetails(visitId);
        console.log("Received visit details:", visitDetails);
        setVisitData(visitDetails);

        console.log("Fetching diagnosis results for visitId:", visitId);
        const diagnosisResults = await getDiagnosisResults(visitId);
        console.log("Received diagnosis results:", diagnosisResults);
        setDiagnosisResult(diagnosisResults.overall_diagnosis);
        setImageDiagnoses(diagnosisResults.image_diagnoses);
      } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        setError('Failed to load diagnosis data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [visitId, isOpen]);

  const handleDownloadReport = async () => {
    try {
      const blob = await downloadVisitReport(visitId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${visitData.patient_name}_visit_report_${visitId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const renderSeverityAlert = () => {
    if (!diagnosisResult || !diagnosisResult.severity_level) return null;

    const severityConfig = {
      severe: { 
        color: 'bg-red-50 border-red-200', 
        textColor: 'text-red-800',
        iconColor: 'text-red-500',
        icon: AlertTriangle, 
        title: 'Severe', 
        description: 'This case requires immediate attention and treatment.' 
      },
      moderate: { 
        color: 'bg-yellow-50 border-yellow-200', 
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-500',
        icon: AlertTriangle, 
        title: 'Moderate', 
        description: 'Close monitoring and prompt treatment is recommended.' 
      },
      mild: { 
        color: 'bg-green-50 border-green-200', 
        textColor: 'text-green-800',
        iconColor: 'text-green-500',
        icon: CheckCircle, 
        title: 'Mild', 
        description: 'Standard treatment protocol is advised.' 
      },
    };

    const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
    const Icon = config.icon;

    return (
      <div className={`${config.color} border ${config.textColor} rounded-lg shadow-sm`}>
        <div className="px-4 py-3 flex items-start">
          <div className={`${config.iconColor} mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h4 className="font-semibold">{config.title} Severity</h4>
            <p className="text-sm mt-1">{config.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderConfidenceIndicator = (confidence) => {
    // Convert the confidence value (0-1) to percentage
    const percentage = confidence * 100;
    let color = 'bg-red-500';
    
    if (percentage >= 90) {
      color = 'bg-green-500';
    } else if (percentage >= 70) {
      color = 'bg-blue-500';
    } else if (percentage >= 50) {
      color = 'bg-yellow-500';
    }

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    );
  };

  const chartData = diagnosisResult ? [
    { name: 'Parasite Count', value: diagnosisResult.count, color: '#4F46E5' },
    { name: 'Total WBCs', value: diagnosisResult.total_wbcs, color: '#10B981' },
  ] : [];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      suspected: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      negative: 'bg-blue-100 text-blue-800 border-blue-200',
      inconclusive: 'bg-gray-100 text-gray-800 border-gray-200',
      // Add other statuses as needed
    };
    
    const statusClass = statusConfig[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
        {status}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto" id="diagnosis-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none print:w-full print:max-w-none print:bg-white print:rounded-none">
        {/* Header section */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl p-6 flex justify-between items-center print:bg-white print:text-black print:border-b print:rounded-none print:border-gray-300">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4 print:hidden">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Clinical Diagnosis Report</h2>
              <p className="text-sm text-blue-100 mt-1 print:text-gray-600">Comprehensive Parasitology Analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 print:hidden">
            <button 
              onClick={handlePrintReport}
              aria-label="Print report"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
            >
              <Printer size={20} className="text-white" />
            </button>
            <button 
              onClick={onClose} 
              aria-label="Close modal"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 print:bg-white">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading patient data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6 print:space-y-4">
              {/* Report metadata banner */}
              {visitData && (
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200 print:border print:rounded-none">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-full mr-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Report Date</p>
                        <p className="font-medium">{new Date(visitData.visit_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-50 rounded-full mr-3">
                        <User className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Patient</p>
                        <p className="font-medium">{visitData.patient_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-green-50 rounded-full mr-3">
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="font-medium">{visitData.patient_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-50 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Visit</p>
                        <p className="font-medium">#{visitData.visit_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {visitData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:gap-4">
                  {/* Patient Information Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 print:bg-white print:border-gray-200">
                      <h3 className="font-bold text-lg text-indigo-800 flex items-center print:text-black">
                        <User className="mr-2 print:hidden" size={20} /> Patient Information
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-medium">{visitData.patient_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Gender</p>
                          <p className="font-medium">{visitData.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="font-medium">{visitData.age} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Patient ID</p>
                          <p className="font-medium">{visitData.patient_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visit Details Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                    <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 print:bg-white print:border-gray-200">
                      <h3 className="font-bold text-lg text-teal-800 flex items-center print:text-black">
                        <Calendar className="mr-2 print:hidden" size={20} /> Visit Details
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Visit ID</p>
                          <p className="font-medium">#{visitData.visit_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Visit Date</p>
                          <p className="font-medium">{new Date(visitData.visit_date).toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Reason for Visit</p>
                          <p className="font-medium">{visitData.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Navigation - hiding on print */}
              <div className="mb-6 print:hidden">
                <div className="flex flex-wrap bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
                  {[
                    { id: 'diagnosis', label: 'Diagnosis', icon: Activity },
                    { id: 'symptoms', label: 'Symptoms', icon: Thermometer },
                    { id: 'treatment', label: 'Treatment Plan', icon: ClipboardList },
                    { id: 'next-steps', label: 'Next Steps', icon: FileText },
                  ].map(({ id, label, icon: TabIcon }) => (
                    <button
                      key={id}
                      className={`flex-1 py-2.5 px-3 rounded-lg transition-all flex items-center justify-center ${
                        activeTab === id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(id)}
                    >
                      <TabIcon size={16} className="mr-2" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* All content sections - showing all on print */}
              <div className="space-y-8 print:space-y-4">
                {/* DIAGNOSIS SECTION */}
                {(activeTab === 'diagnosis' || true) && diagnosisResult && (
                  <div className={`space-y-6 print:space-y-4 ${activeTab !== 'diagnosis' ? 'hidden print:block' : ''}`}>
                    <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center">
                        <Activity className="mr-2 print:hidden" size={22} /> Diagnosis Results
                      </h3>
                      {diagnosisResult.status && (
                        <div className="flex items-center">
                          {renderStatusBadge(diagnosisResult.status)}
                        </div>
                      )}
                    </div>

                    {/* Severity Alert */}
                    <div className="mb-4">{renderSeverityAlert()}</div>

                    {/* Main diagnosis info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center print:bg-white print:border-gray-200">
                        <h4 className="font-medium text-blue-800 print:text-black">Parasite Analysis</h4>
                        <p className="text-xs text-blue-600 flex items-center print:text-gray-500">
                          <Clock size={14} className="mr-1" /> 
                          Analysis completed {new Date(visitData.visit_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-blue-700">
                                  <Activity size={24} />
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Identified Parasite</p>
                              <p className="text-xl font-bold text-gray-800">{diagnosisResult.parasite_name}</p>
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-green-700">
                                  <BarChart2 size={24} />
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Parasite Density</p>
                              <p className="text-xl font-bold text-gray-800">{diagnosisResult.parasite_density.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">parasites/μL</p>
                            </div>
                          </div>
                          <div className="bg-indigo-50 p-4 rounded-lg text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                                <span className="text-indigo-700">
                                  <CheckCircle size={24} />
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Confidence</p>
                              <p className="text-xl font-bold text-gray-800">
                                {(diagnosisResult.average_confidence * 100).toFixed(2)}%
                              </p>
                              {renderConfidenceIndicator(diagnosisResult.average_confidence)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="text-blue-800 text-lg font-bold">{diagnosisResult.count}</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Parasite Count</p>
                              <p className="font-medium">Total detected parasites</p>
                              <p className="text-xs text-gray-500 mt-1">Across all analyzed images</p>
                            </div>
                          </div>
                          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="text-green-800 text-lg font-bold">{diagnosisResult.total_wbcs}</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">White Blood Cells</p>
                              <p className="font-medium">{diagnosisResult.total_wbcs} cells/μL</p>
                              <p className="text-xs text-gray-500 mt-1">Used in parasite density calculation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visualization Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                      {/* Bar Chart */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 print:bg-white">
                          <h4 className="font-medium text-gray-700">Count Comparison</h4>
                        </div>
                        <div className="p-5">
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                                <YAxis tick={{ fill: '#6B7280' }} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.375rem',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                                  }} 
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Distribution Chart */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 print:bg-white">
                          <h4 className="font-medium text-gray-700">Findings Distribution</h4>
                        </div>
                        <div className="p-5">
                          <div className="h-64 flex items-center justify-center">
                            {diagnosisResult && (
                              <div className="w-full h-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { name: 'Parasites', value: diagnosisResult.count },
                                        { name: 'WBCs', value: diagnosisResult.total_wbcs }
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                      {[
                                        { name: 'Parasites', value: diagnosisResult.count },
                                        { name: 'WBCs', value: diagnosisResult.total_wbcs }
                                      ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Details Accordion */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors print:hidden"
                        onClick={() => setShowImageDetails(!showImageDetails)}
                      >
                        <h4 className="font-medium text-gray-700 flex items-center">
                          <span className="mr-2">Individual Image Results</span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {imageDiagnoses.length}
                          </span>
                        </h4>
                        {showImageDetails ? 
                          <ChevronUp className="text-gray-500" size={20} /> : 
                          <ChevronDown className="text-gray-500" size={20} />
                        }
                      </button>
                      
                      {/* Always show in print mode */}
                      <div className="hidden print:block px-6 py-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3">Individual Image Results ({imageDiagnoses.length})</h4>
                      </div>
                      
                      {(showImageDetails || true) && (
                        <div className={`border-t border-gray-200 p-5 ${!showImageDetails ? 'hidden print:block' : ''}`}>
                          <div className="space-y-3">
                            {imageDiagnoses.map((diagnosis, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center border border-gray-100">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                  <span className="text-indigo-700 font-medium">{index + 1}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                  <div>
                                    <p className="text-xs text-gray-500">Image ID</p>
                                    <p className="font-medium">{diagnosis.image_id}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Parasite Count</p>
                                    <p className="font-medium">{diagnosis.count}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">WBC Count</p>
                                    <p className="font-medium">{diagnosis.wbc_count}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SYMPTOMS SECTION */}
                {(activeTab === 'symptoms' || true) && visitData && (
                  <div className={`space-y-6 print:space-y-4 ${activeTab !== 'symptoms' ? 'hidden print:block' : ''}`}>
                    <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center">
                        <Thermometer className="mr-2 print:hidden" size={22} /> Symptoms & Clinical Notes
                      </h3>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 print:bg-white print:border-gray-200">
                        <h4 className="font-medium text-yellow-800 flex items-center print:text-black">
                          Reported Symptoms
                        </h4>
                      </div>
                      <div className="p-5">
                        <div className="bg-gray-50 p-4 rounded-lg min-h-16 border border-gray-100">
                          {visitData.symptoms || 'No symptoms recorded'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 print:bg-white print:border-gray-200">
                        <h4 className="font-medium text-purple-800 print:text-black">Clinical Notes</h4>
                      </div>
                      <div className="p-5">
                        <div className="bg-gray-50 p-4 rounded-lg min-h-16 border border-gray-100">
                          {visitData.notes || 'No notes recorded'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TREATMENT SECTION */}
                {(activeTab === 'treatment' || true) && (
                  <div className={`space-y-6 print:space-y-4 ${activeTab !== 'treatment' ? 'hidden print:block' : ''}`}>
                    <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center">
                        <ClipboardList className="mr-2 print:hidden" size={22} /> Treatment Plan
                      </h3>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <div className="bg-green-50 px-6 py-4 border-b border-green-100 print:bg-white print:border-gray-200">
                        <h4 className="font-medium text-green-800 print:text-black">Recommended Treatment</h4>
                      </div>
                      <div className="p-5">
                        <div className="print:hidden">
                          <textarea
                            placeholder="Enter detailed treatment plan here..."
                            value={treatmentPlan}
                            onChange={(e) => setTreatmentPlan(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            rows={8}
                          />
                        </div>
                        <div className="hidden print:block">
                          <div className="bg-gray-50 p-4 rounded-lg min-h-16 border border-gray-100">
                            {treatmentPlan || 'No treatment plan recorded'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NEXT STEPS SECTION */}
                {(activeTab === 'next-steps' || true) && (
                  <div className={`space-y-6 print:space-y-4 ${activeTab !== 'next-steps' ? 'hidden print:block' : ''}`}>
                    <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center">
                        <FileText className="mr-2 print:hidden" size={22} /> Follow-up & Next Steps
                      </h3>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border print:rounded-none">
                      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 print:bg-white print:border-gray-200">
                        <h4 className="font-medium text-blue-800 print:text-black">Recommended Follow-up</h4>
                      </div>
                      <div className="p-5">
                        <div className="print:hidden">
                          <textarea
                            placeholder="Enter follow-up recommendations and next steps here..."
                            value={nextSteps}
                            onChange={(e) => setNextSteps(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            rows={8}
                          />
                        </div>
                        <div className="hidden print:block">
                          <div className="bg-gray-50 p-4 rounded-lg min-h-16 border border-gray-100">
                            {nextSteps || 'No follow-up plan recorded'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with signatures - shown only in print */}
              <div className="hidden print:block mt-8 border-t border-gray-300 pt-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs text-gray-500 mb-6">Attending Physician</p>
                    <div className="border-b border-gray-400 pb-1 mb-2"></div>
                    <p className="text-sm text-gray-700">Date: ____________________</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-6">Laboratory Director</p>
                    <div className="border-b border-gray-400 pb-1 mb-2"></div>
                    <p className="text-sm text-gray-700">Date: ____________________</p>
                  </div>
                </div>
              </div>

              {/* Action buttons - hidden in print */}
              <div className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 p-4 rounded-b-2xl flex justify-between print:hidden">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrintReport}
                    className="flex items-center justify-center py-2.5 px-4 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Printer className="mr-2" size={18} /> Print
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center transition-colors shadow-md"
                  >
                    <Download className="mr-2" size={18} /> Download Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisModal;