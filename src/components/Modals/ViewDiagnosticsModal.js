// // File: src/components/Modals/ViewDiagnosticsModal.js
// import React, { useState, useEffect } from 'react';
// import { getPatient, getDiagnosisResults, downloadReport } from '../../services/api';
// import { Download, X } from 'lucide-react';

// const ViewDiagnosticsModal = ({ isOpen, onClose, patientId }) => {
//   const [patient, setPatient] = useState(null);
//   const [diagnostics, setDiagnostics] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [overallStatus, setOverallStatus] = useState('Pending');

//   useEffect(() => {
//     const fetchData = async () => {
//       if (patientId && isOpen) {
//         setIsLoading(true);
//         try {
//           const patientData = await getPatient(patientId);
//           setPatient(patientData);
//           const diagnosticsData = await getDiagnosisResults(patientId);
//           setDiagnostics(diagnosticsData);
//           setOverallStatus(diagnosticsData.length > 0 ? 'Completed' : 'Pending');
//         } catch (error) {
//           console.error('Error fetching data:', error);
//           alert('Failed to fetch patient data');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [patientId, isOpen]);

//   const handleDownloadReport = async () => {
//     try {
//       const blob = await downloadReport(patientId);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `patient_${patientId}_report.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       alert('Failed to download report');
//     }
//   };

//   if (!isOpen || isLoading) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
//       <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl my-8">
//         <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 rounded-t-lg">
//           <h2 className="text-2xl font-bold">Patient Diagnostics</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-200">
//             <X size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold mb-3 text-gray-700">Patient Information</h3>
//               {patient && (
//                 <>
//                   <p><strong>Name:</strong> {patient.name}</p>
//                   <p><strong>ID:</strong> {patient.patient_id}</p>
//                   <p><strong>Email:</strong> {patient.email}</p>
//                   <p><strong>Age:</strong> {patient.age}</p>
//                   <p><strong>Gender:</strong> {patient.gender}</p>
//                   <p><strong>Address:</strong> {patient.address}</p>
//                 </>
//               )}
//             </div>
//             <div className="col-span-2">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold text-gray-700">Diagnostic Results</h3>
//                 <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
//                   overallStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {overallStatus}
//                 </span>
//               </div>
//               {diagnostics.length > 0 ? (
//                 <div className="overflow-x-auto bg-white rounded-lg shadow">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parasite</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {diagnostics.map((diagnostic, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(diagnostic.result_date).toLocaleDateString()}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{diagnostic.parasite_name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diagnostic.count}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diagnostic.average_confidence.toFixed(2)}%</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               diagnostic.severity_level === 'high' ? 'bg-red-100 text-red-800' :
//                               diagnostic.severity_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-green-100 text-green-800'
//                             }`}>
//                               {diagnostic.severity_level}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               diagnostic.status === 'positive' ? 'bg-red-100 text-red-800' :
//                               diagnostic.status === 'negative' ? 'bg-green-100 text-green-800' :
//                               'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {diagnostic.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 italic">Diagnostic results are pending. Please check back later.</p>
//               )}
//             </div>
//           </div>
//           <div className="mt-6 flex justify-end">
//             <button 
//               onClick={handleDownloadReport}
//               className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 mr-4"
//             >
//               <Download size={18} className="mr-2" />
//               Download Report
//             </button>
//             <button 
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewDiagnosticsModal;
// import React, { useState, useEffect } from 'react';
// import { getPatient, getDiagnosisResults, downloadReport, getPatientVisits, createVisit, uploadImages } from '../../services/api';
// import { Download, X, Plus, Upload } from 'lucide-react';

// const ViewDiagnosticsModal = ({ isOpen, onClose, patientId }) => {
//   const [patient, setPatient] = useState(null);
//   const [visits, setVisits] = useState([]);
//   const [selectedVisit, setSelectedVisit] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (patientId && isOpen) {
//         setIsLoading(true);
//         try {
//           const patientData = await getPatient(patientId);
//           setPatient(patientData);
//           const visitsData = await getPatientVisits(patientId);
//           setVisits(visitsData);
//           if (visitsData.length > 0) {
//             setSelectedVisit(visitsData[0]);
//           }
//         } catch (error) {
//           console.error('Error fetching data:', error);
//           alert('Failed to fetch patient data');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [patientId, isOpen]);

//   const handleDownloadReport = async (visitId) => {
//     try {
//       const blob = await downloadReport(patientId, visitId);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `patient_${patientId}_visit_${visitId}_report.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       alert('Failed to download report');
//     }
//   };

//   const handleNewVisit = async () => {
//     try {
//       const newVisit = await createVisit(patientId);
//       setVisits([newVisit, ...visits]);
//       setSelectedVisit(newVisit);
//     } catch (error) {
//       console.error('Error creating new visit:', error);
//       alert('Failed to create new visit');
//     }
//   };

//   const handleFileUpload = async (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 5) {
//       alert('You can only upload up to 5 images at a time.');
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file, index) => {
//       formData.append('images', file);
//       formData.append('smear_type', 'thick'); // You might want to let the user choose these
//       formData.append('test_type', 'Giemsa'); // You might want to let the user choose these
//     });

//     setIsUploading(true);
//     try {
//       await uploadImages(patientId, selectedVisit.visit_id, formData);
//       alert('Images uploaded successfully');
//       // Refresh the visit data
//       const updatedVisits = await getPatientVisits(patientId);
//       setVisits(updatedVisits);
//       setSelectedVisit(updatedVisits.find(visit => visit.visit_id === selectedVisit.visit_id));
//     } catch (error) {
//       console.error('Error uploading images:', error);
//       alert('Failed to upload images');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   if (!isOpen || isLoading) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
//       <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl my-8">
//         <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 rounded-t-lg">
//           <h2 className="text-2xl font-bold">Patient Diagnostics</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-200">
//             <X size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold mb-3 text-gray-700">Patient Information</h3>
//               {patient && (
//                 <>
//                   <p><strong>Name:</strong> {patient.name}</p>
//                   <p><strong>ID:</strong> {patient.patient_id}</p>
//                   <p><strong>Email:</strong> {patient.email}</p>
//                   <p><strong>Age:</strong> {patient.age}</p>
//                   <p><strong>Gender:</strong> {patient.gender}</p>
//                   <p><strong>Address:</strong> {patient.address}</p>
//                 </>
//               )}
//             </div>
//             <div className="col-span-2">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold text-gray-700">Visit History</h3>
//                 <button 
//                   onClick={handleNewVisit}
//                   className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
//                 >
//                   <Plus size={18} className="mr-1" />
//                   New Visit
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow p-4">
//                 {visits.length > 0 ? (
//                   <div>
//                     <div className="flex space-x-2 mb-4 overflow-x-auto">
//                       {visits.map((visit) => (
//                         <button
//                           key={visit.visit_id}
//                           onClick={() => setSelectedVisit(visit)}
//                           className={`px-3 py-1 rounded ${
//                             selectedVisit?.visit_id === visit.visit_id
//                               ? 'bg-blue-500 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           {new Date(visit.visit_date).toLocaleDateString()}
//                         </button>
//                       ))}
//                     </div>
//                     {selectedVisit && (
//                       <div>
//                         <h4 className="text-md font-semibold mb-2">Visit Details</h4>
//                         <p><strong>Date:</strong> {new Date(selectedVisit.visit_date).toLocaleString()}</p>
//                         <p><strong>Status:</strong> {selectedVisit.diagnosis_status}</p>
//                         <p><strong>Images:</strong> {selectedVisit.image_count}</p>
//                         <input
//                           type="file"
//                           multiple
//                           onChange={handleFileUpload}
//                           disabled={isUploading}
//                           className="mt-2"
//                         />
//                         {selectedVisit.diagnosis_results.length > 0 ? (
//                           <div className="mt-4">
//                             <h5 className="text-md font-semibold mb-2">Diagnosis Results</h5>
//                             <table className="min-w-full divide-y divide-gray-200">
//                               <thead className="bg-gray-50">
//                                 <tr>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parasite</th>
//                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="bg-white divide-y divide-gray-200">
//                                 {selectedVisit.diagnosis_results.map((result, index) => (
//                                   <tr key={index}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.parasite_name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         result.status === 'positive' ? 'bg-red-100 text-red-800' :
//                                         result.status === 'negative' ? 'bg-green-100 text-green-800' :
//                                         'bg-yellow-100 text-yellow-800'
//                                       }`}>
//                                         {result.status}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         ) : (
//                           <p className="text-gray-500 italic mt-2">No diagnosis results available for this visit.</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 italic">No visits recorded yet.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="mt-6 flex justify-end">
//             <button 
//               onClick={handleDownloadReport}
//               className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 mr-4"
//             >
//               <Download size={18} className="mr-2" />
//               Download Report
//             </button>
//             <button 
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewDiagnosticsModal;

// import React, { useState, useEffect } from 'react';
// import { getPatient, getPatientVisits, createVisit, uploadImages, downloadReport } from '../../services/api';
// import { Download, X, Plus, Upload } from 'lucide-react';

// const ViewDiagnosticsModal = ({ isOpen, onClose, patientId }) => {
//   const [patient, setPatient] = useState(null);
//   const [visits, setVisits] = useState([]);
//   const [selectedVisit, setSelectedVisit] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       if (patientId && isOpen) {
//         setIsLoading(true);
//         setError(null);
//         try {
//           const [patientData, visitsData] = await Promise.all([
//             getPatient(patientId),
//             getPatientVisits(patientId)
//           ]);
//           setPatient(patientData);
//           setVisits(visitsData);
//           if (visitsData.length > 0) {
//             setSelectedVisit(visitsData[0]);
//           }
//         } catch (error) {
//           console.error('Error fetching data:', error);
//           setError('Failed to fetch patient data. Please try again.');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [patientId, isOpen]);

//   if (!isOpen) return null;

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg">
//           <p>Loading patient data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg">
//           <p className="text-red-500">{error}</p>
//           <button 
//             onClick={onClose}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }
//   const handleNewVisit = async () => {
//     try {
//       const newVisit = await createVisit(patientId);
//       setVisits([newVisit, ...visits]);
//       setSelectedVisit(newVisit);
//     } catch (error) {
//       console.error('Error creating new visit:', error);
//       alert('Failed to create new visit');
//     }
//   };

//   const handleFileUpload = async (event, visitId) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 5) {
//       alert('You can only upload up to 5 images at a time.');
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append('images', file);
//     });

//     setIsUploading(true);
//     try {
//       await uploadImages(patientId, visitId, formData);
//       alert('Images uploaded successfully');
//       // Refresh the visit data
//       const updatedVisits = await getPatientVisits(patientId);
//       setVisits(updatedVisits);
//       setSelectedVisit(updatedVisits.find(visit => visit.visit_id === visitId));
//     } catch (error) {
//       console.error('Error uploading images:', error);
//       alert('Failed to upload images');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDownloadReport = async (visitId) => {
//     setIsDownloading(true);
//     try {
//       const blob = await downloadReport(patientId, visitId);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `patient_${patientId}_visit_${visitId}_report.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       alert('Failed to download report');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (!isOpen || isLoading) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
//       <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl my-8">
//         <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 rounded-t-lg">
//           <h2 className="text-2xl font-bold">Patient Diagnostics</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-200">
//             <X size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold mb-3 text-gray-700">Patient Information</h3>
//               {patient && (
//                 <>
//                   <p><strong>Name:</strong> {patient.name}</p>
//                   <p><strong>ID:</strong> {patient.patient_id}</p>
//                   <p><strong>Email:</strong> {patient.email}</p>
//                   <p><strong>Age:</strong> {patient.age}</p>
//                   <p><strong>Gender:</strong> {patient.gender}</p>
//                   <p><strong>Address:</strong> {patient.address}</p>
//                 </>
//               )}
//             </div>
//             <div className="col-span-2">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold text-gray-700">Visit History</h3>
//                 <button 
//                   onClick={handleNewVisit}
//                   className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
//                 >
//                   <Plus size={18} className="mr-1" />
//                   New Visit
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow p-4">
//                 {visits.length > 0 ? (
//                   <div>
//                     {visits.map((visit) => (
//                       <div key={visit.visit_id} className="mb-4 p-4 border rounded">
//                         <h4 className="text-md font-semibold mb-2">
//                           Visit Date: {new Date(visit.visit_date).toLocaleDateString()}
//                         </h4>
//                         <p><strong>Status:</strong> {visit.diagnosis_status}</p>
//                         <p><strong>Images:</strong> {visit.image_count}</p>
//                         <div className="mt-2 flex flex-wrap items-center">
//                           <input
//                             type="file"
//                             multiple
//                             onChange={(e) => handleFileUpload(e, visit.visit_id)}
//                             disabled={isUploading}
//                             className="mr-2 mb-2"
//                           />
//                           <button 
//                             onClick={() => setSelectedVisit(visit)}
//                             className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 mr-2 mb-2"
//                           >
//                             View Details
//                           </button>
//                           <button 
//                             onClick={() => handleDownloadReport(visit.visit_id)}
//                             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 flex items-center mb-2"
//                             disabled={isDownloading}
//                           >
//                             <Download size={18} className="mr-1" />
//                             {isDownloading ? 'Downloading...' : 'Download Report'}
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 italic">No visits recorded yet.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           {selectedVisit && (
//             <div className="mt-6 bg-white rounded-lg shadow p-4">
//               <h3 className="text-lg font-semibold mb-3 text-gray-700">Selected Visit Details</h3>
//               <p><strong>Date:</strong> {new Date(selectedVisit.visit_date).toLocaleString()}</p>
//               <p><strong>Status:</strong> {selectedVisit.diagnosis_status}</p>
//               <h4 className="text-md font-semibold mt-4 mb-2">Diagnosis Results</h4>
//               {selectedVisit.diagnosis_results.length > 0 ? (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parasite</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {selectedVisit.diagnosis_results.map((result, index) => (
//                       <tr key={index}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.parasite_name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.count}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.average_confidence.toFixed(2)}%</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             result.severity_level === 'high' ? 'bg-red-100 text-red-800' :
//                             result.severity_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {result.severity_level}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             result.status === 'positive' ? 'bg-red-100 text-red-800' :
//                             result.status === 'negative' ? 'bg-green-100 text-green-800' :
//                             'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {result.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p className="text-gray-500 italic">No diagnosis results available for this visit.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

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