
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { getPatientsWithVisits, getVisitDetails, initiateDiagnosis } from '../../services/api';
// import { Calendar, Upload, Eye, Activity, ChevronDown, ChevronUp, Search, Clock, FileText, User, Thermometer, RefreshCw } from 'lucide-react';
// import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
// import 'react-vertical-timeline-component/style.min.css';
// import UploadImagesModal from '../Modals/UploadImagesModal';
// import DiagnosisModal from '../Modals/DiagnosisModal';
// import EnhancedInitiateDiagnosisButton from './EnhancedInitiateDiagnosisButton';

// const PatientVisitCard = ({ patient, onViewDiagnosis }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [visitDetails, setVisitDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
//   const [error, setError] = useState(null);
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
//     switch (status.toLowerCase()) {
//       case 'awaiting images': return '#FF0000';
//       case 'pending': return '#FFA500';
//       case 'in_progress': return '#63b3ed';
//       case 'completed': return '#48bb78';
//       default: return '#a0aec0';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status.toLowerCase()) {
//       case 'awaiting images': return <Upload size={16}/>;
//       case 'pending': return <Clock size={16}/>;
//       case 'in_progress': return <Activity size={16} />;
//       case 'completed': return <Activity size={16} />;
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

//   const handleInitiateDiagnosis = async (updateProgress) => {
//     try {
//       updateProgress(25);
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating some processing time
//       updateProgress(50);
//       await initiateDiagnosis(visitDetails.visit_id);
//       updateProgress(75);
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating some processing time
//       updateProgress(100);
//       await fetchVisitDetails(visitDetails.visit_id);
//     } catch (error) {
//       console.error('Error initiating diagnosis:', error);
//       throw error;
//     }
//   };

//   const handleMaxImagesUploaded = () => {
//     fetchVisitDetails(visitDetails.visit_id);
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
//     status = 'awaiting images';
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
//           {imageCount < 5 ? (
//             <button 
//               className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium flex items-center"
//               onClick={handleUploadClick}
//             >
//               <Upload size={20} className="mr-2" />
//               Upload Images
//             </button>
//           ) : status === 'pending' ? (
//             <EnhancedInitiateDiagnosisButton onInitiate={handleInitiateDiagnosis} />
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
//         onMaxImagesUploaded={handleMaxImagesUploaded}
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
import { 
  Calendar, Upload, Eye, Activity, ChevronDown, ChevronUp, Search, 
  Clock, FileText, User, Thermometer, RefreshCw, Filter, ArrowUpDown,
  AlertCircle, CheckCircle, ArrowRight, Plus, MoreHorizontal, Clipboard,
  Users, UserCheck, CalendarCheck, ShieldAlert, Stethoscope
} from 'lucide-react';
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

  const getStatusConfig = (status) => {
    const configs = {
      'awaiting images': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <Upload size={16} className="text-red-500" />,
        label: 'Awaiting Images'
      },
      'pending': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock size={16} className="text-yellow-500" />,
        label: 'Awaiting Diagnosis'
      },
      'in_progress': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Activity size={16} className="text-blue-500" />,
        label: 'Diagnosis in Progress'
      },
      'completed': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle size={16} className="text-green-500" />,
        label: 'Diagnosed'
      },
      'default': {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <AlertCircle size={16} className="text-gray-500" />,
        label: 'Unknown Status'
      }
    };
    
    return configs[status.toLowerCase()] || configs.default;
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
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="animate-pulse h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="animate-pulse mt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6 mb-4">
        <div className="flex items-center text-red-500 mb-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Error Loading Visit</h3>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!visitDetails) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
        <div className="flex items-center text-gray-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>No visit details available</p>
        </div>
      </div>
    );
  }

  const imageCount = visitDetails.images ? visitDetails.images.length : 0;
  const progressPercentage = (imageCount / 5) * 100;

  let status = visitDetails.status;
  let displayStatus = status;

  if (imageCount === 0) {
    status = 'awaiting images';
    displayStatus = "Awaiting Images";
  } else if (imageCount < 5) {
    displayStatus = "Uploading Images";
  } else if (status === 'pending') {
    displayStatus = "Awaiting Diagnosis";
  } else if (status === 'in_progress') {
    displayStatus = "Diagnosis in Progress";
  } else if (status === 'completed') {
    displayStatus = "Diagnosed";
  }

  const statusConfig = getStatusConfig(status);

  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-5 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-50 p-2.5 rounded-full mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{visitDetails.patient_name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="mr-3">ID: {visitDetails.patient_id}</span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(visitDetails.visit_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="ml-1.5">{statusConfig.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => handleViewDetails(visitDetails.visit_id)}
              title="View Details"
            >
              <Eye size={18} />
            </button>
            
            <div className="relative">
              {imageCount < 5 ? (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition-colors"
                  onClick={handleUploadClick}
                >
                  <Upload size={16} className="mr-2" />
                  Upload Images
                </button>
              ) : status === 'pending' ? (
                <EnhancedInitiateDiagnosisButton onInitiate={handleInitiateDiagnosis} />
              ) : (
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsDiagnosisModalOpen(true)}
                >
                  <Activity size={16} className="mr-2" />
                  View Diagnosis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-4">
        {/* Visit Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <Stethoscope className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-500">Reason for Visit</span>
            </div>
            <p className="text-sm text-gray-800">{visitDetails.reason || 'Check Up'}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <Thermometer className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-500">Symptoms</span>
            </div>
            <p className="text-sm text-gray-800 line-clamp-2">{visitDetails.symptoms || 'Not specified'}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <FileText className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-500">Clinical Notes</span>
            </div>
            <p className="text-sm text-gray-800 line-clamp-2">{visitDetails.notes || 'No notes'}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center mb-2">
              <Clipboard className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-500">Image Uploads</span>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-800">{imageCount} of 5 uploaded</span>
                <span className="text-xs font-medium text-blue-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${progressPercentage < 100 ? 'bg-blue-600' : 'bg-green-600'}`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Section Toggle */}
        <button 
          className="w-full flex items-center justify-center py-2 border-t border-b border-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 
            <><ChevronUp className="mr-1.5" size={16} /> Hide Visit History</> : 
            <><ChevronDown className="mr-1.5" size={16} /> Show Visit History</>}
        </button>

        {/* Expandable Section Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4 overflow-hidden"
            >
              <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                <CalendarCheck className="w-4 h-4 mr-2 text-blue-600" />
                Patient Visit History
              </h4>
              
              {patient.visit_history && patient.visit_history.length > 0 ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <VerticalTimeline layout="1-column-left" lineColor="#E2E8F0">
                    {patient.visit_history.map((visit, index) => {
                      const isLastItem = index === patient.visit_history.length - 1;
                      let iconStyle, icon;
                      
                      if (visit.status === 'diagnosed') {
                        iconStyle = { background: '#10B981', color: '#fff' };
                        icon = <CheckCircle />;
                      } else {
                        iconStyle = { background: '#60A5FA', color: '#fff' };
                        icon = <Clock />;
                      }
                      
                      return (
                        <VerticalTimelineElement
                          key={index}
                          className="vertical-timeline-element--work"
                          contentStyle={{ 
                            background: 'white', 
                            color: '#1F2937', 
                            boxShadow: 'none', 
                            padding: '1rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.5rem'
                          }}
                          contentArrowStyle={{ borderRight: '7px solid white' }}
                          date={new Date(visit.date).toLocaleDateString()}
                          iconStyle={iconStyle}
                          icon={icon}
                        >
                          <div className={`${isLastItem ? 'font-medium text-blue-700' : ''}`}>
                            <h3 className="vertical-timeline-element-title text-sm font-medium">
                              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                            </h3>
                            <p className="text-xs mt-1 text-gray-600">{visit.reason || 'No reason specified'}</p>
                          </div>
                        </VerticalTimelineElement>
                      );
                    })}
                  </VerticalTimeline>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 border border-gray-200">
                  <p className="text-sm">No previous visit history available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
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

  const getFilteredCount = () => {
    return filteredAndSortedPatients.length;
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Page Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Patient Visits</h1>
                <p className="text-blue-100 text-sm mt-1">Manage and monitor patient visit records</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/new-visit')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Plus className="mr-2" size={16} />
                New Visit
              </button>
              <button
                onClick={fetchPatientsWithVisits}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Search & Filters */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search patients by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="flex items-center px-3 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                  {isFilterExpanded ? 
                    <ChevronUp size={16} className="ml-2" /> : 
                    <ChevronDown size={16} className="ml-2" />
                  }
                </button>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center px-3 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <ArrowUpDown size={16} className="mr-2" />
                  {sortBy === 'date' ? 'Date' : 'Name'}
                </button>
              </div>
            </div>
            
            {/* Expanded Filters */}
            <AnimatePresence>
              {isFilterExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      >
                        <option value="all">All Statuses</option>
                        <option value="awaiting images">Awaiting Images</option>
                        <option value="awaiting diagnosis">Awaiting Diagnosis</option>
                        <option value="diagnosed">Diagnosed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      >
                        <option value="date">Visit Date</option>
                        <option value="name">Patient Name</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{getFilteredCount()}</span> patients found
                    </p>
                    
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setSortBy('date');
                        setSortOrder('desc');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-gray-50 min-h-screen">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading patient records...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-sm" role="alert">
              <div className="flex items-center mb-2">
                <ShieldAlert className="h-5 w-5 mr-2" />
                <p className="font-bold">Error</p>
              </div>
              <p>{error}</p>
              <button 
                onClick={fetchPatientsWithVisits}
                className="mt-3 text-sm font-medium text-red-700 flex items-center hover:text-red-900"
              >
                <RefreshCw size={14} className="mr-1" /> Try Again
              </button>
            </div>
          ) : currentPatients.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patient visits found</h3>
              <p className="text-gray-600 mb-6">There are no patient visits matching your current filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Clear Filters
              </button>
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, paginate }) => {
  // Generate an array of page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If there are fewer pages than the max to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);
      
      // Calculate the range of pages to show around the current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis before if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add the pages in the middle
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show the last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <nav className="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 border-r border-gray-200 text-gray-600 flex items-center ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
      >
        <ChevronUp className="h-4 w-4 rotate-90" />
        <span className="sr-only">Previous</span>
      </button>
      
      {getPageNumbers().map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' ? paginate(number) : null}
          className={`px-3 py-2 border-r border-gray-200 ${
            currentPage === number
              ? 'bg-blue-50 text-blue-700 font-medium'
              : number === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-600 hover:bg-gray-50'
          }`}
          disabled={number === '...'}
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-gray-600 flex items-center ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
      >
        <ChevronUp className="h-4 w-4 -rotate-90" />
        <span className="sr-only">Next</span>
      </button>
    </nav>
  );
};

export default Visits;