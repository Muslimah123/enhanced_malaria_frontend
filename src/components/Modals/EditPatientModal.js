// import React, { useState, useEffect } from 'react';
// import { getPatient, updatePatient } from '../../services/api';

// const EditPatientModal = ({ isOpen, onClose, patient, onEditComplete }) => {
//   const [editedPatient, setEditedPatient] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   useEffect(() => {
//     const fetchPatient = async () => {
//       if (patient && isOpen) {
//         setIsLoading(true);
//         setError(null);
//         try {
//           const data = await getPatient(patient.patient_id);
//           setEditedPatient(data);
//         } catch (error) {
//           console.error('Error fetching patient:', error);
//           setError('Failed to fetch patient data. Please try again.');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchPatient();
//   }, [patient, isOpen]);

//   const handleChange = (e) => {
//     setEditedPatient({ ...editedPatient, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsSaving(true);
//   //   setError(null);
//   //   setSuccessMessage(null);
//   //   try {
//   //     const updatedPatient = await updatePatient(editedPatient.patient_id, editedPatient);
//   //     setSuccessMessage('Patient updated successfully!');
//   //     onEditComplete(updatedPatient);
//   //     setTimeout(() => {
//   //       setSuccessMessage(null);
//   //       onClose();
//   //     }, 5000); // Close the modal after 2 seconds
//   //   } catch (error) {
//   //     console.error('Update failed:', error);
//   //     setError('Failed to update patient. Please try again.');
//   //   } finally {
//   //     setIsSaving(false);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setError(null);
//     setSuccessMessage(null);
//     try {
//       console.log('Sending data:', editedPatient);
//       const updatedPatient = await updatePatient(editedPatient.patient_id, editedPatient);
//       console.log('Received updated patient:', updatedPatient);
//       setSuccessMessage('Patient updated successfully!');
//       onEditComplete(updatedPatient);
//       setTimeout(() => {
//         setSuccessMessage(null);
//         onClose();
//       }, 5000);
//     } catch (error) {
//       console.error('Update failed:', error);
//       setError('Failed to update patient. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };
//   const handleCloseError = () => {
//     setError(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Edit Patient</h2>
//         {isLoading ? (
//           <p>Loading patient data...</p>
//         ) : error ? (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Error!</strong>
//             <span className="block sm:inline"> {error}</span>
//             <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={handleCloseError}>
//               <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                 <title>Close</title>
//                 <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
//               </svg>
//             </span>
//           </div>
//         ) : successMessage ? (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Success!</strong>
//             <span className="block sm:inline"> {successMessage}</span>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={editedPatient.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={editedPatient.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={editedPatient.age}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Gender</label>
//               <select
//                 name="gender"
//                 value={editedPatient.gender}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
//                 required
//               >
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <textarea
//                 name="address"
//                 value={editedPatient.address}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
//                 required
//               />
//             </div>
//             <div className="flex justify-end">
//               <button 
//                 type="button" 
//                 onClick={onClose}
//                 className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//                 disabled={isSaving}
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit" 
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 disabled={isSaving}
//               >
//                 {isSaving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditPatientModal;
import React, { useState, useEffect } from 'react';
import { getPatient, updatePatient } from '../../services/api';
import { 
  X, User, Mail, Calendar, MapPin, Save, 
  AlertCircle, CheckCircle, Loader, UserCog, 
  Users, Clock, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditPatientModal = ({ isOpen, onClose, patient, onEditComplete }) => {
  const [editedPatient, setEditedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (patient && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getPatient(patient.patient_id);
          setEditedPatient(data);
        } catch (error) {
          console.error('Error fetching patient:', error);
          setError('Failed to fetch patient data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatient();
  }, [patient, isOpen]);

  const handleChange = (e) => {
    setEditedPatient({ ...editedPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('Sending data:', editedPatient);
      const updatedPatient = await updatePatient(editedPatient.patient_id, editedPatient);
      console.log('Received updated patient:', updatedPatient);
      setSuccessMessage('Patient updated successfully!');
      onEditComplete(updatedPatient);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000); // Show success message for 2 seconds before closing
    } catch (error) {
      console.error('Update failed:', error);
      setError('Failed to update patient. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                <UserCog className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Edit Patient</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Patient ID Banner */}
        {editedPatient && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Patient ID: <span className="font-medium text-gray-700">{editedPatient.patient_id}</span></span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-blue-50 rounded-full p-3 mb-4">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-600">Loading patient data...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium">Error</h3>
                    <p className="text-sm">{error}</p>
                    <button 
                      onClick={handleCloseError}
                      className="text-red-700 underline text-sm mt-2 hover:text-red-900"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-6 animate-pulse">
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Success</h3>
                    <p className="text-sm">{successMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {!isLoading && !error && !successMessage && editedPatient && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={editedPatient.name}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={editedPatient.email}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={editedPatient.age}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="gender"
                      value={editedPatient.gender}
                      onChange={handleChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    value={editedPatient.address}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EditPatientModal;