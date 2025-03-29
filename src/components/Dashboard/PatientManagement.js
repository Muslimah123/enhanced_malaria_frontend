
// import React, { useState, useEffect, useCallback } from 'react';
// import { getPatients } from '../../services/api'; // Adjust this import to your actual API file
// import EditPatientModal from '../Modals/EditPatientModal';
// import DeletePatientModal from '../Modals/DeletePatientModal';
// import CreateVisitModal from '../Modals/CreateVisitModal';
// import PatientRegistrationModal from '../Modals/PatientRegistrationModal';
// import { motion } from 'framer-motion';
// import { Users, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// const PatientManagement = () => {
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchStatus, setSearchStatus] = useState('all');
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
//   const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

//   // Fetch patients when currentPage, searchTerm, or searchStatus changes
//   const fetchPatients = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const data = await getPatients(currentPage, 10, searchStatus, searchTerm); // Pass searchTerm and searchStatus
//       setPatients(data.patients);
//       setTotalPages(data.totalPages);
//     } catch (err) {
//       setError('Failed to fetch patients. Please try again.');
//       console.error('Error fetching patients:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentPage, searchTerm, searchStatus]);

//   useEffect(() => {
//     fetchPatients();
//   }, [fetchPatients]);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     setCurrentPage(newPage);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     fetchPatients();
//   };

//   const handleRefresh = () => {
//     setCurrentPage(1);
//     setSearchTerm('');
//     setSearchStatus('all');
//     fetchPatients();
//   };

//   // Handlers for modals
//   const handleEditPatient = (patient) => {
//     setSelectedPatient(patient);
//     setIsEditModalOpen(true);
//   };

//   const handleDeletePatient = (patient) => {
//     setSelectedPatient(patient);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCreateVisit = (patient) => {
//     setSelectedPatient(patient);
//     setIsCreateVisitModalOpen(true);
//   };

//   const handleEditComplete = (updatedPatient) => {
//     setPatients(patients.map(p => p.patient_id === updatedPatient.patient_id ? updatedPatient : p));
//     setIsEditModalOpen(false);
//   };

//   const handleDeleteComplete = () => {
//     setPatients(patients.filter(p => p.patient_id !== selectedPatient.patient_id));
//     setIsDeleteModalOpen(false);
//   };

//   const handlePatientAdded = (newPatient) => {
//     setPatients([newPatient, ...patients]); // Add new patient to the top of the list
//     setIsRegistrationModalOpen(false);
//   };
  

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white shadow-lg rounded-lg p-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//             <Users className="mr-2" /> Patient Management
//           </h1>
//           <button 
//             onClick={() => setIsRegistrationModalOpen(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center"
//           >
//             <PlusCircle className="mr-2" /> Register New Patient
//           </button>
//         </div>

//         {/* Search and Filter */}
//         <form onSubmit={handleSearch} className="mb-4 flex items-center space-x-2">
//           <div className="relative flex-grow">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//             <Search className="absolute right-3 top-2 text-gray-400" />
//           </div>
//           <select
//             value={searchStatus}
//             onChange={(e) => setSearchStatus(e.target.value)}
//             className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="no_visit">No Visit</option>
//             <option value="positive">Positive</option>
//             <option value="negative">Negative</option>
//             <option value="inconclusive">Inconclusive</option>
//           </select>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
//             Search
//           </button>
//           <button type="button" onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
//             Refresh
//           </button>
//         </form>

//         {isLoading ? (
//   <div className="text-center py-4">Loading patients...</div>
// ) : error ? (
//   <div className="text-center py-4 text-red-500">{error}</div>
// ) : (
//   <>
//     {patients.length > 0 ? (
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 text-left">ID</th>
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Age</th>
//               <th className="py-3 px-4 text-left">Gender</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map(patient => (
//               <motion.tr 
//                 key={patient.patient_id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="border-b hover:bg-gray-50"
//               >
//                 <td className="py-3 px-4">{patient.patient_id || 'N/A'}</td>
//                 <td className="py-3 px-4">{patient.name || 'N/A'}</td>
//                 <td className="py-3 px-4">{patient.email || 'N/A'}</td>
//                 <td className="py-3 px-4">{patient.age || 'N/A'}</td>
//                 <td className="py-3 px-4">{patient.gender || 'N/A'}</td>
//                 <td className="py-3 px-4">{patient.status || 'N/A'}</td>
//                 <td className="py-3 px-4">
//                   <button onClick={() => handleEditPatient(patient)} className="mr-2 text-blue-500 hover:text-blue-700">
//                     <Edit size={18} />
//                   </button>
//                   <button onClick={() => handleDeletePatient(patient)} className="mr-2 text-red-500 hover:text-red-700">
//                     <Trash2 size={18} />
//                   </button>
//                   <button onClick={() => handleCreateVisit(patient)} className="text-green-500 hover:text-green-700">
//                     <PlusCircle size={18} />
//                   </button>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     ) : (
//       <div className="text-center py-4">No patients found matching your search criteria.</div>
//     )}
//   </>
// )}


//         {/* Pagination Controls */}
//         <div className="mt-4 flex justify-between items-center">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       </motion.div>

//       {/* Modals for Editing, Deleting, and Creating Visits */}
//       <EditPatientModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         patient={selectedPatient}
//         onEditComplete={handleEditComplete}
//       />

//       <DeletePatientModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         patientId={selectedPatient?.patient_id}
//         patientName={selectedPatient?.name}
//         onDeleteComplete={handleDeleteComplete}
//       />

//       <CreateVisitModal
//         isOpen={isCreateVisitModalOpen}
//         onClose={() => setIsCreateVisitModalOpen(false)}
//         patient={selectedPatient}
//         onVisitCreated={fetchPatients} // Refresh data after creating a visit
//       />

//       <PatientRegistrationModal
//         isOpen={isRegistrationModalOpen}
//         onClose={() => setIsRegistrationModalOpen(false)}
//         onPatientAdded={handlePatientAdded}
//       />
//     </div>
//   );
// };

// export default PatientManagement;
import React, { useState, useEffect, useCallback } from 'react';
import { getPatients } from '../../services/api'; // Adjust this import to your actual API file
import EditPatientModal from '../Modals/EditPatientModal';
import DeletePatientModal from '../Modals/DeletePatientModal';
import CreateVisitModal from '../Modals/CreateVisitModal';
import PatientRegistrationModal from '../Modals/PatientRegistrationModal';
import { motion } from 'framer-motion';
import { 
  Users, Edit, Trash2, PlusCircle, Search, ChevronLeft, 
  ChevronRight, RefreshCw, Filter, ArrowUpDown, UserPlus,
  Mail, Calendar, UserCircle, Activity, AlertCircle, CheckCircle,
  PlusSquare, FileText, AlertTriangle, ArrowRight, ChevronDown
} from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Fetch patients when currentPage, searchTerm, or searchStatus changes
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPatients(currentPage, 10, searchStatus, searchTerm); // Pass searchTerm and searchStatus
      setPatients(data.patients);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to fetch patients. Please try again.');
      console.error('Error fetching patients:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, searchStatus]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPatients();
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setSearchStatus('all');
    fetchPatients();
  };

  // Handlers for modals
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleCreateVisit = (patient) => {
    setSelectedPatient(patient);
    setIsCreateVisitModalOpen(true);
  };

  const handleEditComplete = (updatedPatient) => {
    setPatients(patients.map(p => p.patient_id === updatedPatient.patient_id ? updatedPatient : p));
    setIsEditModalOpen(false);
  };

  const handleDeleteComplete = () => {
    setPatients(patients.filter(p => p.patient_id !== selectedPatient.patient_id));
    setIsDeleteModalOpen(false);
  };

  const handlePatientAdded = (newPatient) => {
    setPatients([newPatient, ...patients]); // Add new patient to the top of the list
    setIsRegistrationModalOpen(false);
  };
  
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      'positive': { color: 'bg-red-100 text-red-800 border-red-200', icon: <AlertCircle size={14} className="mr-1.5" /> },
      'negative': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle size={14} className="mr-1.5" /> },
      'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Activity size={14} className="mr-1.5" /> },
      'inconclusive': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <AlertTriangle size={14} className="mr-1.5" /> },
      'no_visit': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <FileText size={14} className="mr-1.5" /> },
    };
    
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page if not already included
      if (endPage !== totalPages) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Patient Management</h1>
                <p className="text-blue-100 text-sm mt-1">View and manage hospital patient records</p>
              </div>
            </div>
            <button 
              onClick={() => setIsRegistrationModalOpen(true)}
              className="bg-white text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center font-medium shadow-sm"
            >
              <UserPlus className="mr-2" size={18} /> Register New Patient
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 bg-white">
          <form onSubmit={handleSearch} className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-grow min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search patients by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="no_visit">No Visit</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="inconclusive">Inconclusive</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                >
                  <Search size={16} className="mr-2" /> Search
                </button>
                <button 
                  type="button" 
                  onClick={handleRefresh} 
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center border border-gray-200"
                >
                  <RefreshCw size={16} className="mr-2" /> Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading patient records...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg max-w-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="font-bold">Error</p>
                </div>
                <p>{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-3 text-sm font-medium text-red-700 flex items-center hover:text-red-900"
                >
                  <RefreshCw size={14} className="mr-1" /> Try Again
                </button>
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">There are no patients matching your current search criteria.</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map(patient => (
                  <motion.tr 
                    key={patient.patient_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.patient_id || 'N/A'}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700 font-medium">{patient.name || 'N/A'}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <Mail size={14} className="text-gray-400 mr-2" />
                        <span>{patient.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-2" />
                        <span>{patient.age || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <UserCircle size={14} className="text-gray-400 mr-2" />
                        <span>{patient.gender || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(patient.status)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          title="Edit Patient"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleCreateVisit(patient)}
                          className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="Create Visit"
                        >
                          <PlusSquare size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          {patients.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      currentPage === 1 
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {getPageNumbers().map((pageNumber, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                      disabled={pageNumber === '...'}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        pageNumber === currentPage
                          ? 'z-10 bg-blue-50 border-blue-200 text-blue-600 font-medium'
                          : pageNumber === '...'
                            ? 'bg-white border-gray-300 text-gray-500'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals for Editing, Deleting, and Creating Visits */}
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patient={selectedPatient}
        onEditComplete={handleEditComplete}
      />

      <DeletePatientModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        patientId={selectedPatient?.patient_id}
        patientName={selectedPatient?.name}
        onDeleteComplete={handleDeleteComplete}
      />

      <CreateVisitModal
        isOpen={isCreateVisitModalOpen}
        onClose={() => setIsCreateVisitModalOpen(false)}
        patient={selectedPatient}
        onVisitCreated={fetchPatients} // Refresh data after creating a visit
      />

      <PatientRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />
    </div>
  );
};

export default PatientManagement;