//src/components/Dashboard/Visits.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getPatientsWithVisits, getVisitDetails, initiateDiagnosis } from '../../services/api';
import { Calendar, Upload, Eye, Activity, ChevronDown, ChevronUp, Search, Clock, FileText, User, Thermometer, RefreshCw, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import UploadImagesModal from '../Modals/UploadImagesModal';
import { ViewDiagnosisButton, DiagnosisLinkButton } from './DiagnosisNavigationButton';
import EnhancedInitiateDiagnosisButton from './EnhancedInitiateDiagnosisButton';

const PatientVisitCard = ({ patient, onViewDiagnosis }) => {
  const [expanded, setExpanded] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
      case 'awaiting images': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'pending': return 'bg-gradient-to-r from-amber-500 to-orange-600';
      case 'in_progress': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-green-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'awaiting images': return <Upload size={16}/>;
      case 'pending': return <Clock size={16}/>;
      case 'in_progress': return <Activity size={16} />;
      case 'completed': return <CheckCircle size={16} />;
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
    return (
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 mb-6 border border-gray-100">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="text-gray-600 font-medium">Loading visit details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 shadow-lg rounded-2xl p-8 mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={24} />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!visitDetails) {
    return (
      <div className="bg-gray-50 shadow-lg rounded-2xl p-8 mb-6 border border-gray-200">
        <div className="flex items-center justify-center text-gray-500">
          <AlertCircle className="mr-2" size={20} />
          No visit details available
        </div>
      </div>
    );
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
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl mr-4">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                {visitDetails.patient_name}
                <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  ID: {visitDetails.patient_id}
                </span>
              </h3>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center shadow-lg ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span className="ml-2">{displayStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Visit Date</p>
            <p className="text-gray-800 font-semibold">{new Date(visitDetails.visit_date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Visit Reason</p>
            <p className="text-gray-800 font-semibold">{visitDetails.reason || 'Check Up'}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
          <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
            <Thermometer className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Symptoms</p>
            <p className="text-gray-800 font-semibold">{visitDetails.symptoms || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Notes</p>
            <p className="text-gray-800 font-semibold">{visitDetails.notes || 'No notes'}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Image Upload Progress</span>
          <span className="text-sm font-bold text-indigo-600">{imageCount}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button 
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-semibold transition-colors group"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="p-1 bg-indigo-50 rounded-lg mr-2 group-hover:bg-indigo-100 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded ? 'Hide Visit History' : 'View Visit History'}
        </button>

        <div className="flex space-x-3">
          <motion.button 
            className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl text-sm font-semibold flex items-center shadow-md hover:shadow-lg transition-all"
            onClick={() => handleViewDetails(visitDetails.visit_id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={18} className="mr-2" />
            View Details
          </motion.button>
          
          {imageCount < 10 ? (
  <motion.button 
    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-semibold flex items-center shadow-md hover:shadow-lg transition-all"
    onClick={handleUploadClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Upload size={18} className="mr-2" />
    Upload Images
  </motion.button>
) : status === 'pending' ? (
  <EnhancedInitiateDiagnosisButton onInitiate={handleInitiateDiagnosis} />
) : (

            <div className="flex space-x-2">
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ViewDiagnosisButton 
                  visitId={visitDetails.visit_id}
                  variant="primary"
                  size="medium"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center shadow-md hover:shadow-lg transition-all"
                >
                  <Activity size={18} className="mr-2" />
                  View Diagnosis
                </ViewDiagnosisButton>
              </motion.div>
              
             
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DiagnosisLinkButton 
                  visitId={visitDetails.visit_id}
                  size="small"
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <h4 className="font-bold mb-4 text-gray-800 text-lg flex items-center">
              <Heart className="mr-2 text-red-500" size={20} />
              Visit History
            </h4>
            {patient.visit_history && patient.visit_history.length > 0 ? (
              <VerticalTimeline layout="1-column-left" lineColor="#E0E7FF">
                {patient.visit_history.map((visit, index) => (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    contentStyle={{ 
                      background: 'linear-gradient(135deg, #F5F7FA 0%, #EEF2FF 100%)', 
                      color: '#1F2937', 
                      boxShadow: '0 3px 10px rgba(0,0,0,0.1)', 
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid #E0E7FF'
                    }}
                    contentArrowStyle={{ borderRight: '7px solid #EEF2FF' }}
                    date={new Date(visit.date).toLocaleDateString()}
                    iconStyle={{ 
                      background: visit.status === 'diagnosed' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
                      color: '#fff',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                    }}
                    icon={visit.status === 'diagnosed' ? <CheckCircle /> : <Clock />}
                  >
                    <h3 className="vertical-timeline-element-title text-base font-bold text-gray-800 capitalize">
                      {visit.status}
                    </h3>
                    <p className="text-sm mt-2 text-gray-600">{visit.reason || 'No reason specified'}</p>
                   
                    {visit.status === 'diagnosed' && visit.visit_id && (
                      <div className="mt-3">
                        <DiagnosisLinkButton 
                          visitId={visit.visit_id}
                          size="small"
                          variant="outline"
                        >
                          View Report
                        </DiagnosisLinkButton>
                      </div>
                    )}
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            ) : (
              <p className="text-sm text-gray-500 italic">No visit history available</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mr-4">
                <Calendar className="text-white" size={36} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Patient Visits</h1>
                <p className="text-gray-600 mt-1">Manage and track patient consultations</p>
              </div>
            </div>
            <motion.button
              onClick={fetchPatientsWithVisits}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="mr-2" size={18} />
              Refresh Data
            </motion.button>
          </div>

          <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search patients by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="awaiting images">Awaiting Images</option>
                  <option value="awaiting diagnosis">Awaiting Diagnosis</option>
                  <option value="diagnosed">Diagnosed</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
                
                <motion.button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sortOrder === 'asc' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </motion.button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading patient data...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-xl shadow-lg" 
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="mr-3 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-lg">Error Loading Data</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
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
              <div className="mt-8 flex justify-center">
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
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center">
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <motion.li key={number}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => paginate(number)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                currentPage === number
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {number}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};

export default Visits;
