// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { getPatientsWithVisits, getVisitDetails, uploadVisitImages, initiateDiagnosis } from '../../services/api';
// import { Calendar, Upload, Eye, Activity, ChevronDown, ChevronUp, Search, Clock, FileText, User, Thermometer, RefreshCw, CheckCircle } from 'lucide-react';
// import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
// import 'react-vertical-timeline-component/style.min.css';
// import UploadImagesModal from '../Modals/UploadImagesModal';
// import DiagnosisModal from '../Modals/DiagnosisModal';

// const PatientVisitCard = ({ patient, onViewDiagnosis }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [visitDetails, setVisitDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDiagnosisInitiating, setIsDiagnosisInitiating] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (patient.latest_visit) {
//       fetchVisitDetails(patient.latest_visit.visit_id);
//     }
//   }, [patient.latest_visit]);

//   const fetchVisitDetails = async (visitId) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const details = await getVisitDetails(visitId);
//       setVisitDetails(details);
//     } catch (err) {
//       console.error('Error fetching visit details:', err);
//       setError('Failed to load visit details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'awaiting-images': return '#FF0000';
//       case 'pending': return '#FFA500';
//       case 'in_progress': return '#63b3ed';
//       case 'completed': return '#48bb78';
//       default: return '#a0aec0';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'awaiting-images': return <Upload size={16}/>;
//       case 'pending': return <Clock size={16}/>;
//       case 'in_progress': return <Activity size={16} />;
//       case 'completed': return <CheckCircle size={16} />;
//       default: return <Clock size={16}/>;
//     }
//   };

//   const handleViewDetails = (visitId) => {
//     navigate(`/diagnostic/${visitId}`);
//   };

//   const handleUploadClick = () => {
//     setIsUploadModalOpen(true);
//   };

//   const handleUploadComplete = () => {
//     setIsUploadModalOpen(false);
//     if (visitDetails) {
//       fetchVisitDetails(visitDetails.visit_id);
//     }
//   };

//   const handleInitiateDiagnosis = async () => {
//     setIsDiagnosisInitiating(true);
//     try {
//       await initiateDiagnosis(visitDetails.visit_id);
//       fetchVisitDetails(visitDetails.visit_id);
//     } catch (error) {
//       console.error('Error initiating diagnosis:', error);
//       setError('Failed to initiate diagnosis. Please try again.');
//     } finally {
//       setIsDiagnosisInitiating(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="bg-white shadow-lg rounded-lg p-6 mb-4">Loading visit details...</div>;
//   }

//   if (error) {
//     return <div className="bg-white shadow-lg rounded-lg p-6 mb-4 text-red-500">{error}</div>;
//   }

//   if (!visitDetails) {
//     return <div className="bg-white shadow-lg rounded-lg p-6 mb-4">No visit details available</div>;
//   }

//   const imageCount = visitDetails.images ? visitDetails.images.length : 0;
//   const progressPercentage = (imageCount / 5) * 100;

//   let status = visitDetails.status;
//   let displayStatus = status;

//   if (imageCount === 0) {
//     status = 'awaiting-images';
//     displayStatus = "Awaiting Images";
//   } else if (imageCount < 5) {
//     displayStatus = "Uploading Images";
//   } else if (status === 'pending') {
//     displayStatus = "Awaiting Diagnosis";
//   } else if (status === 'in_progress') {
//     displayStatus = "Diagnosis in Progress";
//   } else if (status === 'completed') {
//     displayStatus = "Diagnosed";
//   }

//   return (
//     <motion.div 
//       className="bg-white rounded-lg shadow-md p-6 mb-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <div className="flex items-center text-xl font-semibold text-gray-800">
//             <User className="w-6 h-6 mr-2 text-blue-500" />{visitDetails.patient_name}
//             <span className="ml-2 text-sm font-normal text-gray-500">ID: {visitDetails.patient_id}</span>
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center`} style={{ backgroundColor: getStatusColor(status) }}>
//             {getStatusIcon(status)}
//             <span className="ml-1">{displayStatus}</span>
//           </div>
//           <button 
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center"
//             onClick={() => handleViewDetails(visitDetails.visit_id)}
//           >
//             <Eye size={20} className="mr-2" />
//             View Details
//           </button>
//           {status === 'awaiting-images' || imageCount < 5 ? (
//             <button 
//               className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium flex items-center"
//               onClick={handleUploadClick}
//             >
//               <Upload size={20} className="mr-2" />
//               Upload Images
//             </button>
//           ) : status === 'pending' ? (
//             <button 
//               className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
//               onClick={handleInitiateDiagnosis}
//               disabled={isDiagnosisInitiating}
//             >
//               <Activity size={20} className="mr-2" />
//               {isDiagnosisInitiating ? 'Initiating...' : 'Initiate Diagnosis'}
//             </button>
//           ) : (
//             <button 
//               className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-medium flex items-center"
//               onClick={() => setIsDiagnosisModalOpen(true)}
//             >
//               <Activity size={20} className="mr-2" />
//               View Diagnosis
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//         <div className="flex items-center">
//           <Calendar className="w-5 h-5 mr-3 text-blue-500" />
//           <p className="text-gray-700">{new Date(visitDetails.visit_date).toLocaleDateString()}</p>
//         </div>
//         <div className="flex items-center">
//           <Clock className="w-5 h-5 mr-3 text-blue-500"  />
//           <p className="text-gray-700">{visitDetails.reason || 'Check Up'}</p>
//         </div>
//         <div className="flex items-center">
//           <Thermometer className="w-5 h-5 mr-3 text-blue-500"	 />
//           <div>
//             <span className="text-gray-700">Symptoms: {visitDetails.symptoms || 'Not specified'}</span>
//           </div>
//         </div>
//         <div className="flex items-center">
//           <FileText className="w-5 h-5 mr-3 text-blue-500"  />
//           <div>
//             <span className="text-gray-700">Notes: {visitDetails.notes || 'No notes'}</span>
//           </div>
//         </div>
//       </div>

//       <div className="mb-4">
//         <div className="flex justify-between mb-2">
//           <span className="text-sm font-medium text-gray-500">Images uploaded</span>
//           <span className="text-sm font-medium text-blue-500">{imageCount}/5</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
//           <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
//         </div>
//       </div>

//       <button 
//         className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium"
//         onClick={() => setExpanded(!expanded)}
//       >
//         {expanded ? <ChevronUp className="mr-2" size={16} /> : <ChevronDown className="mr-2" size={16} />}
//         {expanded ? 'Hide Additional Information' : 'Show Additional Information'}
//       </button>

//       <AnimatePresence>
//         {expanded && (
//           <motion.div 
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mt-4"
//           >
//             <h4 className="font-semibold mb-2 text-gray-700">Visit History</h4>
//             {patient.visit_history && patient.visit_history.length > 0 ? (
//               <VerticalTimeline layout="1-column-left" lineColor="#E2E8F0">
//                 {patient.visit_history.map((visit, index) => (
//                   <VerticalTimelineElement
//                     key={index}
//                     className="vertical-timeline-element--work"
//                     contentStyle={{ background: 'rgb(229, 231, 235)', color: '#1F2937', boxShadow: 'none', padding: '1rem' }}
//                     contentArrowStyle={{ borderRight: '7px solid rgb(229, 231, 235)' }}
//                     date={new Date(visit.date).toLocaleDateString()}
//                     iconStyle={{ background: visit.status === 'diagnosed' ? '#48bb78' : '#63b3ed', color: '#fff' }}
//                     icon={visit.status === 'diagnosed' ? <Activity /> : <Clock />}
//                   >
//                     <h3 className="vertical-timeline-element-title text-sm font-semibold">{visit.status}</h3>
//                     <p className="text-xs mt-1">{visit.reason || 'No reason specified'}</p>
//                   </VerticalTimelineElement>
//                 ))}
//               </VerticalTimeline>
//             ) : (
//               <p className="text-sm text-gray-500">No visit history available</p>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <UploadImagesModal
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//         visit={visitDetails}
//         onUploadComplete={handleUploadComplete}
//       />

//       <DiagnosisModal 
//         isOpen={isDiagnosisModalOpen}
//         onClose={() => setIsDiagnosisModalOpen(false)}
//         visitId={visitDetails.visit_id}
//       />
//     </motion.div>
//   );
// };

// const Visits = () => {
//   const [patients, setPatients] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('date');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [patientsPerPage] = useState(10);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPatientsWithVisits();
//   }, [currentPage]);

//   const fetchPatientsWithVisits = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await getPatientsWithVisits();
//       setPatients(data);
//       setTotalPages(Math.ceil(data.length / patientsPerPage));
//     } catch (error) {
//       setError('Failed to fetch patients. Please try again.');
//       console.error('Error fetching patients with visits:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewDiagnosis = (visitId) => {
//     navigate(`/diagnosis/${visitId}`);
//   };

//   const filteredAndSortedPatients = patients
//     .filter(patient => 
//       patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (statusFilter === 'all' || (patient.latest_visit && patient.latest_visit.status.toLowerCase() === statusFilter))
//     )
//     .sort((a, b) => {
//       if (sortBy === 'date') {
//         return sortOrder === 'asc' 
//           ? new Date(a.latest_visit.date) - new Date(b.latest_visit.date)
//           : new Date(b.latest_visit.date) - new Date(a.latest_visit.date);
//       } else if (sortBy === 'name') {
//         return sortOrder === 'asc'
//           ? a.name.localeCompare(b.name)
//           : b.name.localeCompare(a.name);
//       }
//       return 0;
//     });

//   const indexOfLastPatient = currentPage * patientsPerPage;
//   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
//   const currentPatients = filteredAndSortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white shadow-xl rounded-lg p-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <Calendar className="mr-2 text-blue-500" size={32} /> Patient Visits
//           </h1>
//           <button
//             onClick={fetchPatientsWithVisits}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
//           >
//             <RefreshCw className="mr-2" size={16} />
//             Refresh
//           </button>
//         </div>

//         <div className="mb-6 flex flex-wrap items-center gap-4">
//           <div className="flex-grow relative">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           </div>
//           <div className="flex items-center space-x-2">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               <option value="all">All Statuses</option>
//               <option value="awaiting images">Awaiting Images</option>
//               <option value="awaiting diagnosis">Awaiting Diagnosis</option>
//               <option value="diagnosed">Diagnosed</option>
//             </select>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               <option value="date">Sort by Date</option>
//               <option value="name">Sort by Name</option>
//             </select>
//             <button
//               onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//               className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
//             >
//               {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//           </div>
//         ) : (
//           <>
//             <AnimatePresence>
//               {currentPatients.map(patient => (
//                 <PatientVisitCard
//                   key={patient.patient_id}
//                   patient={patient}
//                   onViewDiagnosis={handleViewDiagnosis}
//                 />
//               ))}
//             </AnimatePresence>
//             <div className="mt-6 flex justify-center">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 paginate={paginate}
//               />
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// const Pagination = ({ currentPage, totalPages, paginate }) => {
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav className="flex justify-center mt-4">
//       <ul className="flex space-x-2">
//         {pageNumbers.map(number => (
//           <li key={number}>
//             <button
//               onClick={() => paginate(number)}
//               className={`px-4 py-2 rounded-md ${
//                 currentPage === number
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               } transition-colors duration-200`}
//             >
//               {number}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Visits;
    
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getPatientsWithVisits, getVisitDetails, initiateDiagnosis } from '../../services/api';
import { Calendar, Upload, Eye, Activity, ChevronDown, ChevronUp, Search, Clock, FileText, User, Thermometer, RefreshCw } from 'lucide-react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import UploadImagesModal from '../Modals/UploadImagesModal';
import DiagnosisModal from '../Modals/DiagnosisModal';
import EnhancedInitiateDiagnosisButton from './EnhancedInitiateDiagnosisButton';

const PatientVisitCard = ({ patient, onViewDiagnosis }) => {
  const [expanded, setExpanded] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (patient.latest_visit) {
      fetchVisitDetails(patient.latest_visit.visit_id);
    }
  }, [patient.latest_visit]);

  const fetchVisitDetails = async (visitId) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getVisitDetails(visitId);
      setVisitDetails(details);
    } catch (err) {
      console.error('Error fetching visit details:', err);
      setError('Failed to load visit details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'awaiting images': return '#FF0000';
      case 'pending': return '#FFA500';
      case 'in_progress': return '#63b3ed';
      case 'completed': return '#48bb78';
      default: return '#a0aec0';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'awaiting images': return <Upload size={16}/>;
      case 'pending': return <Clock size={16}/>;
      case 'in_progress': return <Activity size={16} />;
      case 'completed': return <Activity size={16} />;
      default: return <Clock size={16}/>;
    }
  };

  const handleViewDetails = (visitId) => {
    navigate(`/diagnostic/${visitId}`);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    if (visitDetails) {
      fetchVisitDetails(visitDetails.visit_id);
    }
  };

  const handleInitiateDiagnosis = async (updateProgress) => {
    try {
      updateProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating some processing time
      updateProgress(50);
      await initiateDiagnosis(visitDetails.visit_id);
      updateProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating some processing time
      updateProgress(100);
      await fetchVisitDetails(visitDetails.visit_id);
    } catch (error) {
      console.error('Error initiating diagnosis:', error);
      throw error;
    }
  };

  const handleMaxImagesUploaded = () => {
    fetchVisitDetails(visitDetails.visit_id);
  };

  if (isLoading) {
    return <div className="bg-white shadow-lg rounded-lg p-6 mb-4">Loading visit details...</div>;
  }

  if (error) {
    return <div className="bg-white shadow-lg rounded-lg p-6 mb-4 text-red-500">{error}</div>;
  }

  if (!visitDetails) {
    return <div className="bg-white shadow-lg rounded-lg p-6 mb-4">No visit details available</div>;
  }

  const imageCount = visitDetails.images ? visitDetails.images.length : 0;
  const progressPercentage = (imageCount / 10) * 100;

  let status = visitDetails.status;
  let displayStatus = status;

  if (imageCount === 0) {
    status = 'awaiting images';
    displayStatus = "Awaiting Images";
  } else if (imageCount < 10) {
    displayStatus = "Uploading Images";
  } else if (status === 'pending') {
    displayStatus = "Awaiting Diagnosis";
  } else if (status === 'in_progress') {
    displayStatus = "Diagnosis in Progress";
  } else if (status === 'completed') {
    displayStatus = "Diagnosed";
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex items-center text-xl font-semibold text-gray-800">
            <User className="w-6 h-6 mr-2 text-blue-500" />{visitDetails.patient_name}
            <span className="ml-2 text-sm font-normal text-gray-500">ID: {visitDetails.patient_id}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center`} style={{ backgroundColor: getStatusColor(status) }}>
            {getStatusIcon(status)}
            <span className="ml-1">{displayStatus}</span>
          </div>
          <button 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center"
            onClick={() => handleViewDetails(visitDetails.visit_id)}
          >
            <Eye size={20} className="mr-2" />
            View Details
          </button>
          {imageCount < 10 ? (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium flex items-center"
              onClick={handleUploadClick}
            >
              <Upload size={20} className="mr-2" />
              Upload Images
            </button>
          ) : status === 'pending' ? (
            <EnhancedInitiateDiagnosisButton onInitiate={handleInitiateDiagnosis} />
          ) : (
            <button 
              className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-medium flex items-center"
              onClick={() => setIsDiagnosisModalOpen(true)}
            >
              <Activity size={20} className="mr-2" />
              View Diagnosis
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
          <p className="text-gray-700">{new Date(visitDetails.visit_date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-3 text-blue-500"  />
          <p className="text-gray-700">{visitDetails.reason || 'Check Up'}</p>
        </div>
        <div className="flex items-center">
          <Thermometer className="w-5 h-5 mr-3 text-blue-500"	 />
          <div>
            <span className="text-gray-700">Symptoms: {visitDetails.symptoms || 'Not specified'}</span>
          </div>
        </div>
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-3 text-blue-500"  />
          <div>
            <span className="text-gray-700">Notes: {visitDetails.notes || 'No notes'}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Images uploaded</span>
          <span className="text-sm font-medium text-blue-500">{imageCount}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <button 
        className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronUp className="mr-2" size={16} /> : <ChevronDown className="mr-2" size={16} />}
        {expanded ? 'Hide Additional Information' : 'Show Additional Information'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <h4 className="font-semibold mb-2 text-gray-700">Visit History</h4>
            {patient.visit_history && patient.visit_history.length > 0 ? (
              <VerticalTimeline layout="1-column-left" lineColor="#E2E8F0">
                {patient.visit_history.map((visit, index) => (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgb(229, 231, 235)', color: '#1F2937', boxShadow: 'none', padding: '1rem' }}
                    contentArrowStyle={{ borderRight: '7px solid rgb(229, 231, 235)' }}
                    date={new Date(visit.date).toLocaleDateString()}
                    iconStyle={{ background: visit.status === 'diagnosed' ? '#48bb78' : '#63b3ed', color: '#fff' }}
                    icon={visit.status === 'diagnosed' ? <Activity /> : <Clock />}
                  >
                    <h3 className="vertical-timeline-element-title text-sm font-semibold">{visit.status}</h3>
                    <p className="text-xs mt-1">{visit.reason || 'No reason specified'}</p>
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            ) : (
              <p className="text-sm text-gray-500">No visit history available</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <UploadImagesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        visit={visitDetails}
        onUploadComplete={handleUploadComplete}
        onMaxImagesUploaded={handleMaxImagesUploaded}
      />

      <DiagnosisModal 
        isOpen={isDiagnosisModalOpen}
        onClose={() => setIsDiagnosisModalOpen(false)}
        visitId={visitDetails.visit_id}
      />
    </motion.div>
  );
};

const Visits = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [patientsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientsWithVisits();
  }, [currentPage]);

  const fetchPatientsWithVisits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatientsWithVisits();
      setPatients(data);
      setTotalPages(Math.ceil(data.length / patientsPerPage));
    } catch (error) {
      setError('Failed to fetch patients. Please try again.');
      console.error('Error fetching patients with visits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDiagnosis = (visitId) => {
    navigate(`/diagnosis/${visitId}`);
  };

  const filteredAndSortedPatients = patients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || (patient.latest_visit && patient.latest_visit.status.toLowerCase() === statusFilter))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.latest_visit.date) - new Date(b.latest_visit.date)
          : new Date(b.latest_visit.date) - new Date(a.latest_visit.date);
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredAndSortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-500" size={32} /> Patient Visits
          </h1>
          <button
            onClick={fetchPatientsWithVisits}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Statuses</option>
              <option value="awaiting images">Awaiting Images</option>
              <option value="awaiting diagnosis">Awaiting Diagnosis</option>
              <option value="diagnosed">Diagnosed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            >
              {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {currentPatients.map(patient => (
                <PatientVisitCard
                  key={patient.patient_id}
                  patient={patient}
                  onViewDiagnosis={handleViewDiagnosis}
                />
              ))}
            </AnimatePresence>
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Visits;