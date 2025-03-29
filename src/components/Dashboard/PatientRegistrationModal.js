// / File: src/components/Modals/PatientRegistrationModal.js
// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select } from '@/components/ui/select';
// import { createPatient } from '../../services/api';
// import { useToast } from "@/components/ui/use-toast";

// const PatientRegistrationModal = ({ isOpen, onClose, onPatientAdded }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     age: '',
//     gender: '',
//     address: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const newPatient = await createPatient(formData);
//       onPatientAdded(newPatient);
//       onClose();
//       toast({
//         title: "Success",
//         description: "Patient registered successfully.",
//       });
//     } catch (error) {
//       console.error('Failed to register patient:', error);
//       toast({
//         title: "Error",
//         description: "Failed to register patient. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Register New Patient</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="email" className="text-right">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="age" className="text-right">
//                 Age
//               </Label>
//               <Input
//                 id="age"
//                 name="age"
//                 type="number"
//                 value={formData.age}
//                 onChange={handleChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="gender" className="text-right">
//                 Gender
//               </Label>
//               <Select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="col-span-3"
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </Select>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="address" className="text-right">
//                 Address
//               </Label>
//               <Input
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Registering...' : 'Register Patient'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PatientRegistrationModal;
// File: src/components/Modals/PatientRegistrationModal.js
import React, { useState } from 'react';
import { createPatient } from '../../services/api';
import { CheckCircle, AlertCircle, User, Mail, Calendar, MapPin, Users } from 'lucide-react';

const PatientRegistrationModal = ({ isOpen, onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newPatient = await createPatient(formData);
      // First show the success message
      setShowSuccess(true);
      onPatientAdded(newPatient);
      
      // Don't close the modal right away - let the user see the success message
      // Only close after a delay
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setShowSuccess(false);
          resetForm();
        }, 500);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to register patient:', error);
      setError('Failed to register patient. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      gender: '',
      address: ''
    });
    setError(null);
    setShowSuccess(false);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Register New Patient</h2>
          </div>
        </div>
        
        {/* Success Message - Full-width, very visible */}
        {showSuccess && (
          <div className="px-6 py-5 bg-green-100 border-b border-green-200">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-4 flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-green-800 font-semibold text-lg">Registration Successful!</h3>
                <p className="text-green-700">
                  Patient has been successfully registered in the system
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Registration Failed</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient's full name"
                  required
                  disabled={showSuccess || isSubmitting}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  required
                  disabled={showSuccess || isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient's age"
                  required
                  disabled={showSuccess || isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
                disabled={showSuccess || isSubmitting}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Enter patient's address"
                  required
                  disabled={showSuccess || isSubmitting}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              disabled={isSubmitting || showSuccess}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center"
              disabled={isSubmitting || showSuccess}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationModal;