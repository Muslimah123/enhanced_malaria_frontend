// import React, { useState, useEffect } from 'react';
// import { getVisitDetails, getDiagnosisResults, downloadVisitReport, performanceTracker } from '../../services/api';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { 
//   Download, User, Calendar, Activity, ClipboardList, FileText, 
//   AlertTriangle, CheckCircle, X, Thermometer, Clipboard, 
//   ChevronDown, ChevronUp, Clock, Printer, ArrowLeft,
//   ExternalLink, Share2, BarChart2, Shield, Image, TrendingUp
// } from 'lucide-react';
// import ParasiteDetectionSection from './ParasiteDetectionSection';
// import { initiateDiagnosis } from '../../services/api'; 



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
//   const [selectedImage, setSelectedImage] = useState(null);
  

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

//   const handleInitiateDiagnosis = async () => {
//   const diagnosisId = `diagnosis-ui-${visitId}-${Date.now()}`;
//   performanceTracker.startOperation(diagnosisId, 'diagnosis-ui', { visitId });
  
//   try {
//     // Your existing diagnosis logic
//     const result = await initiateDiagnosis(visitId);
//     performanceTracker.endOperation(diagnosisId, 'success');
//   } catch (error) {
//     performanceTracker.endOperation(diagnosisId, 'error');
//     throw error;
//   }
// };


//   const handlePrintReport = () => {
//     window.print();
//   };

//   const renderSeverityAlert = () => {
//     if (!diagnosisResult || !diagnosisResult.severity_level) return null;

//     const severityConfig = {
//       severe: { 
//         color: 'from-red-50 to-red-100 border-red-200', 
//         textColor: 'text-red-800',
//         iconColor: 'text-red-600',
//         bgIcon: 'bg-red-100',
//         icon: AlertTriangle, 
//         title: 'Severe Condition', 
//         description: 'This case requires immediate attention and treatment.' 
//       },
//       moderate: { 
//         color: 'from-amber-50 to-orange-100 border-orange-200', 
//         textColor: 'text-orange-800',
//         iconColor: 'text-orange-600',
//         bgIcon: 'bg-orange-100',
//         icon: AlertTriangle, 
//         title: 'Moderate Severity', 
//         description: 'Close monitoring and prompt treatment is recommended.' 
//       },
//       mild: { 
//         color: 'from-emerald-50 to-green-100 border-green-200', 
//         textColor: 'text-green-800',
//         iconColor: 'text-green-600',
//         bgIcon: 'bg-green-100',
//         icon: CheckCircle, 
//         title: 'Mild Condition', 
//         description: 'Standard treatment protocol is advised.' 
//       },
//     };

//     const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
//     const Icon = config.icon;

//     return (
//       <div className={`bg-gradient-to-r ${config.color} border-2 ${config.textColor} rounded-2xl shadow-lg p-4`}>
//         <div className="flex items-start">
//           <div className={`p-3 ${config.bgIcon} rounded-xl ${config.iconColor}`}>
//             <Icon className="h-6 w-6" />
//           </div>
//           <div className="ml-4 flex-1">
//             <h4 className="font-bold text-lg">{config.title}</h4>
//             <p className="text-sm mt-1 opacity-90">{config.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderConfidenceIndicator = (confidence) => {
//     const percentage = confidence;
//     let gradientColor = 'from-red-500 to-red-600';
    
//     if (percentage >= 90) {
//       gradientColor = 'from-emerald-500 to-green-600';
//     } else if (percentage >= 70) {
//       gradientColor = 'from-blue-500 to-indigo-600';
//     } else if (percentage >= 50) {
//       gradientColor = 'from-amber-500 to-orange-600';
//     }

//     return (
//       <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden shadow-inner">
//         <div 
//           className={`bg-gradient-to-r ${gradientColor} h-full rounded-full shadow-sm transition-all duration-500`} 
//           style={{ width: `${percentage}%` }}
//           aria-valuenow={percentage}
//           aria-valuemin="0"
//           aria-valuemax="100"
//         ></div>
//       </div>
//     );
//   };

//   const chartData = diagnosisResult ? [
//     { name: 'Parasite Count', value: diagnosisResult.count, color: '#6366F1' },
//     { name: 'Total WBCs', value: diagnosisResult.total_wbcs, color: '#10B981' },
//   ] : [];

//   const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

//   const renderStatusBadge = (status) => {
//     if (!status) return null;
    
//     const statusConfig = {
//       confirmed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
//       suspected: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg',
//       negative: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg',
//       inconclusive: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg',
//       positive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg',
//     };
    
//     const statusClass = statusConfig[status.toLowerCase()] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    
//     return (
//       <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClass}`}>
//         {status}
//       </span>
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0">
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
//       {/* Modal Container */}
//       {/* <div className="relative w-full h-full max-w-6xl max-h-[95vh] m-4 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:max-h-none print:w-full print:max-w-none print:bg-white print:rounded-none"> */}
//       <div className="relative w-full h-[90vh] max-w-6xl m-4 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:max-h-none print:w-full print:max-w-none print:bg-white print:rounded-none">

        
//         {/* Header section */}
//         <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 flex-shrink-0 print:bg-white print:text-black print:border-b print:rounded-none print:border-gray-300">
//           <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
//           <div className="relative flex justify-between items-center">
//             <div className="flex items-center">
//               <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-5 print:hidden">
//                 <Activity className="h-8 w-8" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold">Clinical Diagnosis Report</h2>
//                 <p className="text-base text-indigo-100 mt-1 print:text-gray-600">Comprehensive Parasitology Analysis</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 print:hidden">
//               <button 
//                 onClick={handlePrintReport}
//                 aria-label="Print report"
//                 className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
//               >
//                 <Printer size={22} className="text-white" />
//               </button>
//               <button 
//                 onClick={onClose} 
//                 aria-label="Close modal"
//                 className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
//               >
//                 <X size={22} className="text-white" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 print:bg-white">
//           <div className="p-4">
//             {loading ? (
//               <div className="flex flex-col justify-center items-center h-64">
//                 <div className="relative">
//                   <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="h-10 w-10 bg-white rounded-full shadow-lg"></div>
//                   </div>
//                 </div>
//                 <p className="mt-6 text-gray-600 font-medium">Loading patient data...</p>
//               </div>
//             ) : error ? (
//               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg" role="alert">
//                 <div className="flex items-center">
//                   <AlertTriangle className="mr-3" size={24} />
//                   <div>
//                     <p className="font-bold text-lg">Error Loading Data</p>
//                     <p className="mt-1">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6 print:space-y-4">
//                 {/* Report metadata banner */}
//                 {visitData && (
//                   <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-white/50 print:border print:rounded-none">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                       <div className="flex items-center">
//                         <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-4 shadow-md">
//                           <Calendar className="h-6 w-6 text-indigo-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-medium">Report Date</p>
//                           <p className="font-bold text-gray-800">{new Date(visitData.visit_date).toLocaleDateString()}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mr-4 shadow-md">
//                           <User className="h-6 w-6 text-purple-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-medium">Patient</p>
//                           <p className="font-bold text-gray-800">{visitData.patient_name}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl mr-4 shadow-md">
//                           <Shield className="h-6 w-6 text-emerald-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-medium">Patient ID</p>
//                           <p className="font-bold text-gray-800">{visitData.patient_id}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl mr-4 shadow-md">
//                           <FileText className="h-6 w-6 text-orange-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-medium">Visit ID</p>
//                           <p className="font-bold text-gray-800">#{visitData.visit_id}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {visitData && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:gap-4">
//                     {/* Patient Information Card */}
//                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                       <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 print:bg-white print:border-gray-200">
//                         <h3 className="font-bold text-lg text-white flex items-center print:text-black">
//                           <User className="mr-2 print:hidden" size={20} /> Patient Information
//                         </h3>
//                       </div>
//                       <div className="p-6">
//                         <div className="grid grid-cols-2 gap-y-5">
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
//                             <p className="font-semibold text-gray-800 mt-1">{visitData.patient_name}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Gender</p>
//                             <p className="font-semibold text-gray-800 mt-1">{visitData.gender}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Age</p>
//                             <p className="font-semibold text-gray-800 mt-1">{visitData.age} years</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Patient ID</p>
//                             <p className="font-semibold text-gray-800 mt-1">{visitData.patient_id}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Visit Details Card */}
//                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                       <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 print:bg-white print:border-gray-200">
//                         <h3 className="font-bold text-lg text-white flex items-center print:text-black">
//                           <Calendar className="mr-2 print:hidden" size={20} /> Visit Details
//                         </h3>
//                       </div>
//                       <div className="p-6">
//                         <div className="grid grid-cols-2 gap-y-5">
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Visit ID</p>
//                             <p className="font-semibold text-gray-800 mt-1">#{visitData.visit_id}</p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Visit Date</p>
//                             <p className="font-semibold text-gray-800 mt-1">{new Date(visitData.visit_date).toLocaleDateString()}</p>
//                           </div>
//                           <div className="col-span-2">
//                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Reason for Visit</p>
//                             <p className="font-semibold text-gray-800 mt-1">{visitData.reason}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Tabs Navigation - hiding on print */}
//                 <div className="mb-8 print:hidden">
//                   <div className="flex flex-wrap bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50">
//                     {[
//                       { id: 'diagnosis', label: 'Diagnosis', icon: Activity },
//                       { id: 'detections', label: 'Parasite Detections', icon: Image },
//                       { id: 'symptoms', label: 'Symptoms', icon: Thermometer },
//                       { id: 'treatment', label: 'Treatment Plan', icon: ClipboardList },
//                       { id: 'next-steps', label: 'Next Steps', icon: FileText },
//                     ].map(({ id, label, icon: TabIcon }) => (
//                       <button
//                         key={id}
//                         className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center font-medium ${
//                           activeTab === id
//                             ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
//                             : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                         onClick={() => setActiveTab(id)}
//                       >
//                         <TabIcon size={18} className="mr-2" />
//                         <span>{label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* All content sections */}
//                 <div className="space-y-8 print:space-y-4">
//                   {/* DIAGNOSIS SECTION */}
//                   {(activeTab === 'diagnosis' || true) && diagnosisResult && (
//                     <div className={`space-y-6 print:space-y-4 ${activeTab !== 'diagnosis' ? 'hidden print:block' : ''}`}>
//                       <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
//                         <h3 className="font-bold text-2xl text-gray-800 flex items-center">
//                           <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mr-3 print:hidden">
//                             <Activity className="text-indigo-600" size={24} />
//                           </div>
//                           Diagnosis Results
//                         </h3>
//                         {diagnosisResult.status && (
//                           <div className="flex items-center">
//                             {renderStatusBadge(diagnosisResult.status)}
//                           </div>
//                         )}
//                       </div>

//                       {/* Severity Alert */}
//                       <div className="mb-6">{renderSeverityAlert()}</div>

//                       {/* Main diagnosis info */}
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center print:bg-white print:border-gray-200">
//                           <h4 className="font-semibold text-lg text-white print:text-black">Parasite Analysis Results</h4>
//                           <p className="text-sm text-blue-100 flex items-center print:text-gray-500">
//                             <Clock size={16} className="mr-2" /> 
//                             Analysis completed {new Date(visitData.visit_date).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <div className="p-6">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl text-center shadow-lg border border-blue-200">
//                               <div className="flex flex-col items-center">
//                                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
//                                   <Activity size={28} className="text-white" />
//                                 </div>
//                                 <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Identified Parasite</p>
//                                 <p className="text-2xl font-bold text-gray-800">{diagnosisResult.parasite_name}</p>
//                               </div>
//                             </div>
//                             <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl text-center shadow-lg border border-green-200">
//                               <div className="flex flex-col items-center">
//                                 <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
//                                   <TrendingUp size={28} className="text-white" />
//                                 </div>
//                                 <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Parasite Density</p>
//                                 <p className="text-2xl font-bold text-gray-800">{diagnosisResult.parasite_density.toFixed(2)}</p>
//                                 <p className="text-sm text-gray-600 mt-1">parasites/μL</p>
//                               </div>
//                             </div>
//                             <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl text-center shadow-lg border border-purple-200">
//                               <div className="flex flex-col items-center">
//                                 <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
//                                   <CheckCircle size={28} className="text-white" />
//                                 </div>
//                                 <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Confidence Level</p>
//                                 <p className="text-2xl font-bold text-gray-800">
//                                   {diagnosisResult.average_confidence ? `${diagnosisResult.average_confidence.toFixed(2)}%` : 'N/A'}
//                                 </p>
//                                 {renderConfidenceIndicator(diagnosisResult.average_confidence)}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                             <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
//                               <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
//                                 <span className="text-white text-2xl font-bold">{diagnosisResult.count}</span>
//                               </div>
//                               <div>
//                                 <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Parasite Count</p>
//                                 <p className="font-semibold text-lg text-gray-800 mt-1">Total detected parasites</p>
//                                 <p className="text-sm text-gray-600 mt-1">Across all analyzed images</p>
//                               </div>
//                             </div>
//                             <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
//                               <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
//                                 <span className="text-white text-2xl font-bold">{diagnosisResult.total_wbcs}</span>
//                               </div>
//                               <div>
//                                 <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">White Blood Cells</p>
//                                 <p className="font-semibold text-lg text-gray-800 mt-1">{diagnosisResult.total_wbcs} cells/μL</p>
//                                 <p className="text-sm text-gray-600 mt-1">Used in density calculation</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Visualization Section */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
//                         {/* Bar Chart */}
//                         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                           <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 print:bg-white">
//                             <h4 className="font-semibold text-gray-800 flex items-center">
//                               <BarChart2 className="mr-2 text-gray-600" size={20} />
//                               Count Comparison
//                             </h4>
//                           </div>
//                           <div className="p-6">
//                             <div className="h-64">
//                               <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={chartData}>
//                                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                                   <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
//                                   <YAxis tick={{ fill: '#6B7280' }} />
//                                   <Tooltip 
//                                     contentStyle={{ 
//                                       backgroundColor: '#fff', 
//                                       border: '1px solid #E5E7EB',
//                                       borderRadius: '12px',
//                                       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                                     }} 
//                                   />
//                                   <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                                     {chartData.map((entry, index) => (
//                                       <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                   </Bar>
//                                 </BarChart>
//                               </ResponsiveContainer>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Distribution Chart */}
//                         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                           <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 print:bg-white">
//                             <h4 className="font-semibold text-gray-800 flex items-center">
//                               <TrendingUp className="mr-2 text-gray-600" size={20} />
//                               Findings Distribution
//                             </h4>
//                           </div>
//                           <div className="p-6">
//                             <div className="h-64 flex items-center justify-center">
//                               {diagnosisResult && (
//                                 <div className="w-full h-full flex items-center justify-center">
//                                   <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                       <Pie
//                                         data={[
//                                           { name: 'Parasites', value: diagnosisResult.count },
//                                           { name: 'WBCs', value: diagnosisResult.total_wbcs }
//                                         ]}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={60}
//                                         outerRadius={80}
//                                         paddingAngle={5}
//                                         dataKey="value"
//                                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                       >
//                                         {[
//                                           { name: 'Parasites', value: diagnosisResult.count },
//                                           { name: 'WBCs', value: diagnosisResult.total_wbcs }
//                                         ].map((entry, index) => (
//                                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                         ))}
//                                       </Pie>
//                                       <Tooltip />
//                                     </PieChart>
//                                   </ResponsiveContainer>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Image Details Accordion */}
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <button
//                           className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors print:hidden"
//                           onClick={() => setShowImageDetails(!showImageDetails)}
//                         >
//                           <h4 className="font-semibold text-gray-800 flex items-center">
//                             <span className="mr-3">Individual Image Results</span>
//                             <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
//                               {imageDiagnoses.length} Images
//                             </span>
//                           </h4>
//                           {showImageDetails ? 
//                             <ChevronUp className="text-gray-600" size={22} /> : 
//                             <ChevronDown className="text-gray-600" size={22} />
//                           }
//                         </button>
                        
//                         {/* Always show in print mode */}
//                         <div className="hidden print:block px-6 py-4 border-t border-gray-200">
//                           <h4 className="font-semibold text-gray-800 mb-3">Individual Image Results ({imageDiagnoses.length})</h4>
//                         </div>
                        
//                         {(showImageDetails || true) && (
//                           <div className={`border-t border-gray-200 p-6 ${!showImageDetails ? 'hidden print:block' : ''}`}>
//                             <div className="space-y-4">
//                               {imageDiagnoses.map((diagnosis, index) => (
//                                 <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl flex items-center border border-gray-200 shadow-md">
//                                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
//                                     <span className="text-white font-bold">{index + 1}</span>
//                                   </div>
//                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
//                                     <div>
//                                       <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Image ID</p>
//                                       <p className="font-semibold text-gray-800 mt-1">{diagnosis.image_id}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Parasite Count</p>
//                                       <p className="font-semibold text-gray-800 mt-1">{diagnosis.count}</p>
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">WBC Count</p>
//                                       <p className="font-semibold text-gray-800 mt-1">{diagnosis.wbc_count}</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* PARASITE DETECTIONS SECTION */}
//                   {activeTab === 'detections' && (
//                     <div className="space-y-6">
//                       <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
//                         <h3 className="font-bold text-2xl text-gray-800 flex items-center">
//                           <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mr-3 print:hidden">
//                             <Image className="text-orange-600" size={24} />
//                           </div>
//                           Parasite Detections
//                         </h3>
//                       </div>
                      
//                       <ParasiteDetectionSection visitId={visitId} />
//                     </div>
//                   )}

//                   {/* SYMPTOMS SECTION */}
//                   {(activeTab === 'symptoms' || true) && visitData && (
//                     <div className={`space-y-6 print:space-y-4 ${activeTab !== 'symptoms' ? 'hidden print:block' : ''}`}>
//                       <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
//                         <h3 className="font-bold text-2xl text-gray-800 flex items-center">
//                           <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mr-3 print:hidden">
//                             <Thermometer className="text-amber-600" size={24} />
//                           </div>
//                           Symptoms & Clinical Notes
//                         </h3>
//                       </div>
                      
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 print:bg-white print:border-gray-200">
//                           <h4 className="font-semibold text-white flex items-center print:text-black">
//                             Reported Symptoms
//                           </h4>
//                         </div>
//                         <div className="p-6">
//                           <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-orange-200">
//                             <p className="text-gray-800">{visitData.symptoms || 'No symptoms recorded'}</p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 print:bg-white print:border-gray-200">
//                           <h4 className="font-semibold text-white print:text-black">Clinical Notes</h4>
//                         </div>
//                         <div className="p-6">
//                           <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
//                             <p className="text-gray-800">{visitData.notes || 'No notes recorded'}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* TREATMENT SECTION */}
//                   {(activeTab === 'treatment' || true) && (
//                     <div className={`space-y-6 print:space-y-4 ${activeTab !== 'treatment' ? 'hidden print:block' : ''}`}>
//                       <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
//                         <h3 className="font-bold text-2xl text-gray-800 flex items-center">
//                           <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg mr-3 print:hidden">
//                             <ClipboardList className="text-emerald-600" size={24} />
//                           </div>
//                           Treatment Plan
//                         </h3>
//                       </div>
                      
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 print:bg-white print:border-gray-200">
//                           <h4 className="font-semibold text-white print:text-black">Recommended Treatment Protocol</h4>
//                         </div>
//                         <div className="p-6">
//                           <div className="print:hidden">
//                             <textarea
//                               placeholder="Enter detailed treatment plan here..."
//                               value={treatmentPlan}
//                               onChange={(e) => setTreatmentPlan(e.target.value)}
//                               className="w-full p-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50"
//                               rows={8}
//                             />
//                           </div>
//                           <div className="hidden print:block">
//                             <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-green-200">
//                               <p className="text-gray-800">{treatmentPlan || 'No treatment plan recorded'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* NEXT STEPS SECTION */}
//                   {(activeTab === 'next-steps' || true) && (
//                     <div className={`space-y-6 print:space-y-4 ${activeTab !== 'next-steps' ? 'hidden print:block' : ''}`}>
//                       <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
//                         <h3 className="font-bold text-2xl text-gray-800 flex items-center">
//                           <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3 print:hidden">
//                             <FileText className="text-blue-600" size={24} />
//                           </div>
//                           Follow-up & Next Steps
//                         </h3>
//                       </div>
                      
//                       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
//                         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 print:bg-white print:border-gray-200">
//                           <h4 className="font-semibold text-white print:text-black">Recommended Follow-up Actions</h4>
//                         </div>
//                         <div className="p-6">
//                           <div className="print:hidden">
//                             <textarea
//                               placeholder="Enter follow-up recommendations and next steps here..."
//                               value={nextSteps}
//                               onChange={(e) => setNextSteps(e.target.value)}
//                               className="w-full p-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50"
//                               rows={8}
//                             />
//                           </div>
//                           <div className="hidden print:block">
//                             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
//                               <p className="text-gray-800">{nextSteps || 'No follow-up plan recorded'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Footer with signatures - shown only in print */}
//                 <div className="hidden print:block mt-12 border-t-2 border-gray-300 pt-8">
//                   <div className="grid grid-cols-2 gap-12">
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium mb-8">Attending Physician</p>
//                       <div className="border-b-2 border-gray-400 pb-1 mb-3"></div>
//                       <p className="text-sm text-gray-700">Date: ____________________</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600 font-medium mb-8">Laboratory Director</p>
//                       <div className="border-b-2 border-gray-400 pb-1 mb-3"></div>
//                       <p className="text-sm text-gray-700">Date: ____________________</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer Actions - Sticky at bottom */}
//         <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-t-2 border-gray-200 p-4 flex justify-between print:hidden">
//           <button
//             onClick={onClose}
//             className="flex items-center justify-center py-3 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
//           >
//             <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
//           </button>
//           <div className="flex space-x-4">
//             <button
//               onClick={handlePrintReport}
//               className="flex items-center justify-center py-3 px-6 border-2 border-indigo-600 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-all font-medium"
//             >
//               <Printer className="mr-2" size={20} /> Print Report
//             </button>
//             <button
//               onClick={handleDownloadReport}
//               className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center transition-all shadow-xl hover:shadow-2xl"
//             >
//               <Download className="mr-2" size={20} /> Download PDF
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiagnosisModal;
import React, { useState, useEffect } from 'react';
import { getVisitDetails, getDiagnosisResults, downloadVisitReport, performanceTracker } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Download, User, Calendar, Activity, ClipboardList, FileText, 
  AlertTriangle, CheckCircle, X, Thermometer, Clipboard, 
  ChevronDown, ChevronUp, Clock, Printer, ArrowLeft,
  ExternalLink, Share2, BarChart2, Shield, Image, TrendingUp,
  AlertCircle, Info
} from 'lucide-react';
import ParasiteDetectionSection from '../Dashboard/ParasiteDetectionSection';
import { initiateDiagnosis } from '../../services/api'; 

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosisSummary, setDiagnosisSummary] = useState(null); // For counting validation
  

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
        console.log("Summary from diagnosis results:", diagnosisResults.summary);
        console.log("Counting validation:", diagnosisResults.summary?.counting_validation);
        
        setDiagnosisResult(diagnosisResults.overall_diagnosis);
        setImageDiagnoses(diagnosisResults.image_diagnoses);
        setDiagnosisSummary(diagnosisResults.summary);
        
        // Debug: Log the validation status
        if (diagnosisResults.summary?.counting_validation) {
          console.log("Validation valid:", diagnosisResults.summary.counting_validation.valid);
          console.log("Validation message:", diagnosisResults.summary.counting_validation.message);
        } else {
          console.warn("No counting_validation found in summary");
          
          // Try to get validation data from other sources
          if (diagnosisResults.overall_diagnosis) {
            console.log("Checking overall_diagnosis for validation data:", diagnosisResults.overall_diagnosis);
          }
          
          // If no summary data, try to construct validation manually
          const totalWbcs = diagnosisResults.overall_diagnosis?.total_wbcs || 0;
          const totalParasites = diagnosisResults.overall_diagnosis?.count || 0;
          
          if (totalWbcs > 0) {
            const isValid = (totalParasites >= 100 && totalWbcs >= 200) || 
                           (totalParasites <= 99 && totalWbcs >= 500);
            
            console.log("Manual validation check:", {
              totalParasites,
              totalWbcs,
              isValid,
              reason: isValid ? "Meets WHO criteria" : "Does not meet WHO criteria"
            });
            
            // Create a manual summary if none exists
            if (!diagnosisResults.summary) {
              const manualSummary = {
                total_parasites: totalParasites,
                total_wbcs: totalWbcs,
                counting_validation: {
                  valid: isValid,
                  message: isValid 
                    ? `Valid: ${totalParasites} parasites in ${totalWbcs} WBCs meets WHO criteria`
                    : `Invalid count: ${totalParasites} parasites, ${totalWbcs} WBCs. WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs`,
                  method: isValid ? (totalParasites >= 100 ? "high_parasitemia" : "low_parasitemia") : "insufficient_count"
                }
              };
              
              console.log("Created manual summary:", manualSummary);
              setDiagnosisSummary(manualSummary);
            }
          }
        }
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

  const handleInitiateDiagnosis = async () => {
    const diagnosisId = `diagnosis-ui-${visitId}-${Date.now()}`;
    performanceTracker.startOperation(diagnosisId, 'diagnosis-ui', { visitId });
    
    try {
      const result = await initiateDiagnosis(visitId);
      performanceTracker.endOperation(diagnosisId, 'success');
    } catch (error) {
      performanceTracker.endOperation(diagnosisId, 'error');
      throw error;
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // WHO Validation Warning Component
  const renderWHOValidationWarning = () => {
    // Check multiple sources for validation data
    const validation = diagnosisSummary?.counting_validation || 
                      diagnosisResult?.counting_validation ||
                      null;
    
    const totalWbcs = diagnosisSummary?.total_wbcs || 
                      diagnosisResult?.total_wbcs || 
                      0;
    
    const totalParasites = diagnosisSummary?.total_parasites || 
                          diagnosisResult?.count || 
                          0;

    // Debug logging
    console.log("WHO Validation Check:", {
      validation,
      totalWbcs,
      totalParasites,
      diagnosisSummary,
      diagnosisResult
    });

    // If we have explicit validation data and it's valid, don't show warning
    if (validation && validation.valid === true) {
      return null;
    }

    // If we have explicit validation data and it's invalid, show warning
    if (validation && validation.valid === false) {
      return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-4 shadow-md">
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 rounded-lg mr-3 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-amber-800 flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                WHO Validation Warning
              </h5>
              <p className="text-sm text-amber-700 mb-2">
                <strong>Note:</strong> The parasite density shown is a preliminary estimate. 
                The white blood cell count ({totalWbcs} cells) does not meet 
                WHO's minimum threshold for reliable quantification.
              </p>
              <div className="bg-amber-100 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-800 font-medium">
                  <strong>Validation Details:</strong> {validation.message}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs for reliable density calculation.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If we don't have explicit validation data, do a manual check
    // This is a fallback for when the backend doesn't provide validation info
    if (totalWbcs > 0 && totalParasites >= 0) {
      const isValid = (totalParasites >= 100 && totalWbcs >= 200) || 
                      (totalParasites <= 99 && totalWbcs >= 500);
      
      if (!isValid) {
        return (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-4 shadow-md">
            <div className="flex items-start">
              <div className="p-2 bg-amber-100 rounded-lg mr-3 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-amber-800 flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  WHO Validation Warning
                </h5>
                <p className="text-sm text-amber-700 mb-2">
                  <strong>Note:</strong> The parasite density shown is a preliminary estimate. 
                  The white blood cell count ({totalWbcs} cells) does not meet 
                  WHO's minimum threshold for reliable quantification.
                </p>
                <div className="bg-amber-100 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-800 font-medium">
                    <strong>Current Count:</strong> {totalParasites} parasites in {totalWbcs} WBCs
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs for reliable density calculation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  // Enhanced Parasite Density Card with Validation
  const renderParasiteDensityCard = () => {
    if (!diagnosisResult) return null;

    // Check multiple sources for validation data
    const validation = diagnosisSummary?.counting_validation || 
                      diagnosisResult?.counting_validation ||
                      null;
    
    const totalWbcs = diagnosisSummary?.total_wbcs || 
                      diagnosisResult?.total_wbcs || 
                      0;
    
    const totalParasites = diagnosisSummary?.total_parasites || 
                          diagnosisResult?.count || 
                          0;

    // Determine if count is valid
    let isValidCount = true;
    
    if (validation) {
      isValidCount = validation.valid;
    } else if (totalWbcs > 0 && totalParasites >= 0) {
      // Fallback manual validation
      isValidCount = (totalParasites >= 100 && totalWbcs >= 200) || 
                     (totalParasites <= 99 && totalWbcs >= 500);
    }
    
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl text-center shadow-lg border border-green-200 relative">
        {!isValidCount && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-amber-500 text-white rounded-full p-1 shadow-lg">
              <AlertTriangle size={16} />
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">
            Parasite Density
            {!isValidCount && (
              <span className="ml-1 text-amber-600">⚠️</span>
            )}
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {diagnosisResult.parasite_density?.toFixed(2) || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">parasites/μL</p>
          {!isValidCount && (
            <p className="text-xs text-amber-600 mt-2 font-medium">
              Preliminary estimate*
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderSeverityAlert = () => {
    if (!diagnosisResult || !diagnosisResult.severity_level) return null;

    const severityConfig = {
      severe: { 
        color: 'from-red-50 to-red-100 border-red-200', 
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        bgIcon: 'bg-red-100',
        icon: AlertTriangle, 
        title: 'Severe Condition', 
        description: 'This case requires immediate attention and treatment.' 
      },
      moderate: { 
        color: 'from-amber-50 to-orange-100 border-orange-200', 
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        bgIcon: 'bg-orange-100',
        icon: AlertTriangle, 
        title: 'Moderate Severity', 
        description: 'Close monitoring and prompt treatment is recommended.' 
      },
      mild: { 
        color: 'from-emerald-50 to-green-100 border-green-200', 
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        bgIcon: 'bg-green-100',
        icon: CheckCircle, 
        title: 'Mild Condition', 
        description: 'Standard treatment protocol is advised.' 
      },
    };

    const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
    const Icon = config.icon;

    return (
      <div className={`bg-gradient-to-r ${config.color} border-2 ${config.textColor} rounded-2xl shadow-lg p-4`}>
        <div className="flex items-start">
          <div className={`p-3 ${config.bgIcon} rounded-xl ${config.iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <h4 className="font-bold text-lg">{config.title}</h4>
            <p className="text-sm mt-1 opacity-90">{config.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderConfidenceIndicator = (confidence) => {
    const percentage = confidence;
    let gradientColor = 'from-red-500 to-red-600';
    
    if (percentage >= 90) {
      gradientColor = 'from-emerald-500 to-green-600';
    } else if (percentage >= 70) {
      gradientColor = 'from-blue-500 to-indigo-600';
    } else if (percentage >= 50) {
      gradientColor = 'from-amber-500 to-orange-600';
    }

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden shadow-inner">
        <div 
          className={`bg-gradient-to-r ${gradientColor} h-full rounded-full shadow-sm transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    );
  };

  const chartData = diagnosisResult ? [
    { name: 'Parasite Count', value: diagnosisResult.count, color: '#6366F1' },
    { name: 'Total WBCs', value: diagnosisResult.total_wbcs, color: '#10B981' },
  ] : [];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      confirmed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      suspected: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg',
      negative: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg',
      inconclusive: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg',
      positive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg',
    };
    
    const statusClass = statusConfig[status.toLowerCase()] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClass}`}>
        {status}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full h-[90vh] max-w-6xl m-4 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:max-h-none print:w-full print:max-w-none print:bg-white print:rounded-none">
        
        {/* Header section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 flex-shrink-0 print:bg-white print:text-black print:border-b print:rounded-none print:border-gray-300">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
          <div className="relative flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-5 print:hidden">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Clinical Diagnosis Report</h2>
                <p className="text-base text-indigo-100 mt-1 print:text-gray-600">Comprehensive Parasitology Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 print:hidden">
              <button 
                onClick={handlePrintReport}
                aria-label="Print report"
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
              >
                <Printer size={22} className="text-white" />
              </button>
              <button 
                onClick={onClose} 
                aria-label="Close modal"
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
              >
                <X size={22} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 print:bg-white">
          <div className="p-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">Loading patient data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg" role="alert">
                <div className="flex items-center">
                  <AlertTriangle className="mr-3" size={24} />
                  <div>
                    <p className="font-bold text-lg">Error Loading Data</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 print:space-y-4">
                {/* Report metadata banner */}
                {visitData && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-white/50 print:border print:rounded-none">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-4 shadow-md">
                          <Calendar className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Report Date</p>
                          <p className="font-bold text-gray-800">{new Date(visitData.visit_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mr-4 shadow-md">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Patient</p>
                          <p className="font-bold text-gray-800">{visitData.patient_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl mr-4 shadow-md">
                          <Shield className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Patient ID</p>
                          <p className="font-bold text-gray-800">{visitData.patient_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl mr-4 shadow-md">
                          <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Visit ID</p>
                          <p className="font-bold text-gray-800">#{visitData.visit_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {visitData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:gap-4">
                    {/* Patient Information Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 print:bg-white print:border-gray-200">
                        <h3 className="font-bold text-lg text-white flex items-center print:text-black">
                          <User className="mr-2 print:hidden" size={20} /> Patient Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-y-5">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
                            <p className="font-semibold text-gray-800 mt-1">{visitData.patient_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Gender</p>
                            <p className="font-semibold text-gray-800 mt-1">{visitData.gender}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Age</p>
                            <p className="font-semibold text-gray-800 mt-1">{visitData.age} years</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Patient ID</p>
                            <p className="font-semibold text-gray-800 mt-1">{visitData.patient_id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visit Details Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 print:bg-white print:border-gray-200">
                        <h3 className="font-bold text-lg text-white flex items-center print:text-black">
                          <Calendar className="mr-2 print:hidden" size={20} /> Visit Details
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-y-5">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Visit ID</p>
                            <p className="font-semibold text-gray-800 mt-1">#{visitData.visit_id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Visit Date</p>
                            <p className="font-semibold text-gray-800 mt-1">{new Date(visitData.visit_date).toLocaleDateString()}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Reason for Visit</p>
                            <p className="font-semibold text-gray-800 mt-1">{visitData.reason}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs Navigation - hiding on print */}
                <div className="mb-8 print:hidden">
                  <div className="flex flex-wrap bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50">
                    {[
                      { id: 'diagnosis', label: 'Diagnosis', icon: Activity },
                      { id: 'detections', label: 'Parasite Detections', icon: Image },
                      { id: 'symptoms', label: 'Symptoms', icon: Thermometer },
                      { id: 'treatment', label: 'Treatment Plan', icon: ClipboardList },
                      { id: 'next-steps', label: 'Next Steps', icon: FileText },
                    ].map(({ id, label, icon: TabIcon }) => (
                      <button
                        key={id}
                        className={`flex-1 py-3 px-4 rounded-xl transition-all flex items-center justify-center font-medium ${
                          activeTab === id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(id)}
                      >
                        <TabIcon size={18} className="mr-2" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* All content sections */}
                <div className="space-y-8 print:space-y-4">
                  {/* DIAGNOSIS SECTION */}
                  {(activeTab === 'diagnosis' || true) && diagnosisResult && (
                    <div className={`space-y-6 print:space-y-4 ${activeTab !== 'diagnosis' ? 'hidden print:block' : ''}`}>
                      <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mr-3 print:hidden">
                            <Activity className="text-indigo-600" size={24} />
                          </div>
                          Diagnosis Results
                        </h3>
                        {diagnosisResult.status && (
                          <div className="flex items-center">
                            {renderStatusBadge(diagnosisResult.status)}
                          </div>
                        )}
                      </div>

                      {/* WHO Validation Warning */}
                      {renderWHOValidationWarning()}

                      {/* Severity Alert */}
                      <div className="mb-6">{renderSeverityAlert()}</div>

                      {/* Main diagnosis info */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center print:bg-white print:border-gray-200">
                          <h4 className="font-semibold text-lg text-white print:text-black">Parasite Analysis Results</h4>
                          <p className="text-sm text-blue-100 flex items-center print:text-gray-500">
                            <Clock size={16} className="mr-2" /> 
                            Analysis completed {new Date(visitData.visit_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl text-center shadow-lg border border-blue-200">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                                  <Activity size={28} className="text-white" />
                                </div>
                                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Identified Parasite</p>
                                <p className="text-2xl font-bold text-gray-800">{diagnosisResult.parasite_name}</p>
                              </div>
                            </div>
                            {/* Enhanced Parasite Density Card with Validation */}
                            {renderParasiteDensityCard()}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl text-center shadow-lg border border-purple-200">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                                  <CheckCircle size={28} className="text-white" />
                                </div>
                                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Confidence Level</p>
                                <p className="text-2xl font-bold text-gray-800">
                                  {diagnosisResult.average_confidence ? `${diagnosisResult.average_confidence.toFixed(2)}%` : 'N/A'}
                                </p>
                                {renderConfidenceIndicator(diagnosisResult.average_confidence)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
                                <span className="text-white text-2xl font-bold">{diagnosisResult.count}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Parasite Count</p>
                                <p className="font-semibold text-lg text-gray-800 mt-1">Total detected parasites</p>
                                <p className="text-sm text-gray-600 mt-1">Across all analyzed images</p>
                              </div>
                            </div>
                            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
                              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
                                <span className="text-white text-2xl font-bold">{diagnosisResult.total_wbcs}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">White Blood Cells</p>
                                <p className="font-semibold text-lg text-gray-800 mt-1">{diagnosisResult.total_wbcs} cells/μL</p>
                                <p className="text-sm text-gray-600 mt-1">Used in density calculation</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rest of the component remains the same... */}
                      {/* Visualization Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                        {/* Bar Chart */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 print:bg-white">
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <BarChart2 className="mr-2 text-gray-600" size={20} />
                              Count Comparison
                            </h4>
                          </div>
                          <div className="p-6">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                  <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                                  <YAxis tick={{ fill: '#6B7280' }} />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#fff', 
                                      border: '1px solid #E5E7EB',
                                      borderRadius: '12px',
                                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }} 
                                  />
                                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-300 print:bg-white">
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <TrendingUp className="mr-2 text-gray-600" size={20} />
                              Findings Distribution
                            </h4>
                          </div>
                          <div className="p-6">
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
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <button
                          className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors print:hidden"
                          onClick={() => setShowImageDetails(!showImageDetails)}
                        >
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            <span className="mr-3">Individual Image Results</span>
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
                              {imageDiagnoses.length} Images
                            </span>
                          </h4>
                          {showImageDetails ? 
                            <ChevronUp className="text-gray-600" size={22} /> : 
                            <ChevronDown className="text-gray-600" size={22} />
                          }
                        </button>
                        
                        {/* Always show in print mode */}
                        <div className="hidden print:block px-6 py-4 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-3">Individual Image Results ({imageDiagnoses.length})</h4>
                        </div>
                        
                        {(showImageDetails || true) && (
                          <div className={`border-t border-gray-200 p-6 ${!showImageDetails ? 'hidden print:block' : ''}`}>
                            <div className="space-y-4">
                              {imageDiagnoses.map((diagnosis, index) => (
                                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl flex items-center border border-gray-200 shadow-md">
                                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 shadow-lg">
                                    <span className="text-white font-bold">{index + 1}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    <div>
                                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Image ID</p>
                                      <p className="font-semibold text-gray-800 mt-1">{diagnosis.image_id}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Parasite Count</p>
                                      <p className="font-semibold text-gray-800 mt-1">{diagnosis.count}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">WBC Count</p>
                                      <p className="font-semibold text-gray-800 mt-1">{diagnosis.wbc_count}</p>
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

                  {/* PARASITE DETECTIONS SECTION */}
                  {activeTab === 'detections' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mr-3 print:hidden">
                            <Image className="text-orange-600" size={24} />
                          </div>
                          Parasite Detections
                        </h3>
                      </div>
                      
                      <ParasiteDetectionSection visitId={visitId} />
                    </div>
                  )}

                  {/* SYMPTOMS SECTION */}
                  {(activeTab === 'symptoms' || true) && visitData && (
                    <div className={`space-y-6 print:space-y-4 ${activeTab !== 'symptoms' ? 'hidden print:block' : ''}`}>
                      <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mr-3 print:hidden">
                            <Thermometer className="text-amber-600" size={24} />
                          </div>
                          Symptoms & Clinical Notes
                        </h3>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 print:bg-white print:border-gray-200">
                          <h4 className="font-semibold text-white flex items-center print:text-black">
                            Reported Symptoms
                          </h4>
                        </div>
                        <div className="p-6">
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-orange-200">
                            <p className="text-gray-800">{visitData.symptoms || 'No symptoms recorded'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 print:bg-white print:border-gray-200">
                          <h4 className="font-semibold text-white print:text-black">Clinical Notes</h4>
                        </div>
                        <div className="p-6">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                            <p className="text-gray-800">{visitData.notes || 'No notes recorded'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TREATMENT SECTION */}
                  {(activeTab === 'treatment' || true) && (
                    <div className={`space-y-6 print:space-y-4 ${activeTab !== 'treatment' ? 'hidden print:block' : ''}`}>
                      <div className="flex items-center justify-between print:border-t print:border-gray-300 print:pt-4">
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg mr-3 print:hidden">
                            <ClipboardList className="text-emerald-600" size={24} />
                          </div>
                          Treatment Plan
                        </h3>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 print:bg-white print:border-gray-200">
                          <h4 className="font-semibold text-white print:text-black">Recommended Treatment Protocol</h4>
                        </div>
                        <div className="p-6">
                          <div className="print:hidden">
                            <textarea
                              placeholder="Enter detailed treatment plan here..."
                              value={treatmentPlan}
                              onChange={(e) => setTreatmentPlan(e.target.value)}
                              className="w-full p-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50"
                              rows={8}
                            />
                          </div>
                          <div className="hidden print:block">
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-green-200">
                              <p className="text-gray-800">{treatmentPlan || 'No treatment plan recorded'}</p>
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
                        <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-3 print:hidden">
                            <FileText className="text-blue-600" size={24} />
                          </div>
                          Follow-up & Next Steps
                        </h3>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden print:border print:rounded-none">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 print:bg-white print:border-gray-200">
                          <h4 className="font-semibold text-white print:text-black">Recommended Follow-up Actions</h4>
                        </div>
                        <div className="p-6">
                          <div className="print:hidden">
                            <textarea
                              placeholder="Enter follow-up recommendations and next steps here..."
                              value={nextSteps}
                              onChange={(e) => setNextSteps(e.target.value)}
                              className="w-full p-5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50"
                              rows={8}
                            />
                          </div>
                          <div className="hidden print:block">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                              <p className="text-gray-800">{nextSteps || 'No follow-up plan recorded'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with signatures - shown only in print */}
                <div className="hidden print:block mt-12 border-t-2 border-gray-300 pt-8">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-8">Attending Physician</p>
                      <div className="border-b-2 border-gray-400 pb-1 mb-3"></div>
                      <p className="text-sm text-gray-700">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-8">Laboratory Director</p>
                      <div className="border-b-2 border-gray-400 pb-1 mb-3"></div>
                      <p className="text-sm text-gray-700">Date: ____________________</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Sticky at bottom */}
        <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-t-2 border-gray-200 p-4 flex justify-between print:hidden">
          <button
            onClick={onClose}
            className="flex items-center justify-center py-3 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handlePrintReport}
              className="flex items-center justify-center py-3 px-6 border-2 border-indigo-600 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-all font-medium"
            >
              <Printer className="mr-2" size={20} /> Print Report
            </button>
            <button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center transition-all shadow-xl hover:shadow-2xl"
            >
              <Download className="mr-2" size={20} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisModal;