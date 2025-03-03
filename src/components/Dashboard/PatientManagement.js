
import React, { useState, useEffect, useCallback } from 'react';
import { getPatients } from '../../services/api'; // Adjust this import to your actual API file
import EditPatientModal from '../Modals/EditPatientModal';
import DeletePatientModal from '../Modals/DeletePatientModal';
import CreateVisitModal from '../Modals/CreateVisitModal';
import PatientRegistrationModal from '../Modals/PatientRegistrationModal';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2" /> Patient Management
          </h1>
          <button 
            onClick={() => setIsRegistrationModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <PlusCircle className="mr-2" /> Register New Patient
          </button>
        </div>

        {/* Search and Filter */}
        <form onSubmit={handleSearch} className="mb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search className="absolute right-3 top-2 text-gray-400" />
          </div>
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="no_visit">No Visit</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="inconclusive">Inconclusive</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
            Search
          </button>
          <button type="button" onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
            Refresh
          </button>
        </form>

        {isLoading ? (
  <div className="text-center py-4">Loading patients...</div>
) : error ? (
  <div className="text-center py-4 text-red-500">{error}</div>
) : (
  <>
    {patients.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <motion.tr 
                key={patient.patient_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">{patient.patient_id || 'N/A'}</td>
                <td className="py-3 px-4">{patient.name || 'N/A'}</td>
                <td className="py-3 px-4">{patient.email || 'N/A'}</td>
                <td className="py-3 px-4">{patient.age || 'N/A'}</td>
                <td className="py-3 px-4">{patient.gender || 'N/A'}</td>
                <td className="py-3 px-4">{patient.status || 'N/A'}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEditPatient(patient)} className="mr-2 text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeletePatient(patient)} className="mr-2 text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => handleCreateVisit(patient)} className="text-green-500 hover:text-green-700">
                    <PlusCircle size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-4">No patients found matching your search criteria.</div>
    )}
  </>
)}


        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            <ChevronLeft size={18} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            <ChevronRight size={18} />
          </button>
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
