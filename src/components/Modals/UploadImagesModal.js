
// import React, { useState, useEffect, useCallback } from 'react';
// import { uploadVisitImages, getVisitImageCount } from '../../services/api';
// import { X, Upload, Loader, Activity } from 'lucide-react';
// import imageCompression from 'browser-image-compression';

// const UploadImagesModal = ({ isOpen, onClose, visit, onUploadComplete,onMaxImagesUploaded }) => {
//   const [savedFiles, setSavedFiles] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [totalUploadedImages, setTotalUploadedImages] = useState(0);
//   const [existingImageCount, setExistingImageCount] = useState(null);
//   const [error, setError] = useState(null);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

//   useEffect(() => {
//     if (isOpen) {
//       fetchExistingImageCount();
//     }

//   }, [isOpen, visit.patient_id]);

//   const fetchExistingImageCount = async () => {
//     try {
//       const count = await getVisitImageCount(visit.visit_id);
//       setExistingImageCount(count);
//       setTotalUploadedImages(count);
//     } catch (error) {
//       console.error('Error fetching existing image count:', error);
//       setExistingImageCount(null);
//       setError('Unable to fetch existing image count. Proceeding with caution.');
//     }
//   };

//   const resetState = useCallback(() => {
//     setSavedFiles([]);
//     setIsUploading(false);
//     setIsDragging(false);
//     setUploadProgress(0);
//     setError(null);
    
//   }, []);

//   const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

//   const isAllowedFile = (file) => {
//     const extension = file.name.split('.').pop().toLowerCase();
//     return allowedExtensions.includes(extension);
//   };

//   const handleFileChange = async (event) => {
//     const files = Array.from(event.target.files);
//     await handleNewFiles(files);
//   };

//   const handleDrop = useCallback(async (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     await handleNewFiles(files);
//   }, []);

//   const handleNewFiles = async (files) => {
//     const validFiles = files.filter(isAllowedFile);
//     if (validFiles.length < files.length) {
//       setError('Some files were rejected. Only PNG, JPG, JPEG, and GIF are allowed.');
//     }

//     const maxNewFiles = existingImageCount !== null 
//       ? Math.min(10 - existingImageCount - savedFiles.length, 10 - savedFiles.length) 
//       : 5 - savedFiles.length;

//     const newFiles = validFiles.slice(0, maxNewFiles);

//     if (newFiles.length === 0) {
//       setError('No valid images were selected or maximum number of images reached.');
//       return;
//     }

//     const compressedFiles = await Promise.all(
//       newFiles.map(async (file) => {
//         const compressedFile = await imageCompression(file, { maxSizeMB: 1 });
//         const newFile = new File([compressedFile], file.name, {
//           type: compressedFile.type,
//           lastModified: new Date().getTime()
//         });
//         console.log('Compressed file:', newFile.name, newFile.type, newFile.size);
//         return {
//           file: newFile,
//           smearType: '',
//           testType: '',
//         };
//       })
//     );

//     setSavedFiles((prev) => [...prev, ...compressedFiles].slice(0, maxNewFiles));
//   };

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError(null);

//     if (savedFiles.length === 0) {
//       setError('Please select at least one file before uploading');
//       return;
//     }

//     if (savedFiles.some((file) => !file.smearType || !file.testType)) {
//       setError('Please assign smear type and test type for all images');
//       return;
//     }

//     setIsUploading(true);
//     const formData = new FormData();

//     savedFiles.forEach((file, index) => {
//       console.log(`Uploading file ${index + 1}:`, file.file.name, file.file.type, file.file.size);
//       formData.append(`images`, file.file, file.file.name);
//       formData.append(`smear_type`, file.smearType);
//       formData.append(`test_type`, file.testType);
//     });

//     try {
//       const response = await uploadVisitImages(visit.visit_id, formData, (progress) => {
//         setUploadProgress(progress);
//       });

//       setIsUploading(false);
//       setTotalUploadedImages(response.total_images);
//       onUploadComplete(response.total_images);
//       setShowSuccessMessage(true);

//       if (response.total_images >= 10) {
//         onMaxImagesUploaded();
//       }

//       setTimeout(() => {
//         setUploadProgress(0);
//       }, 10000);

//       setTimeout(() => {
//         setShowSuccessMessage(false);
//         resetState();
//         onClose();
//       }, 30000);

//     } catch (error) {
//       console.error('Upload failed:', error);
//       setIsUploading(false);
//       if (error.response && error.response.data && error.response.data.error) {
//         setError(error.response.data.error);
//       } else {
//         setError('Failed to upload images. Please try again later.');
//       }
//     }
//   };

//   const removeFile = (index) => {
//     setSavedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateFileDetails = (index, field, value) => {
//     setSavedFiles((prev) =>
//       prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
//     );
//   };

 

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//     >
//       <div className="bg-white p-6 rounded-lg w-[32rem] max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">
//             Upload Diagnostic Images for patient {visit.patient_name}
//           </h2>
//           <button
//             onClick={() => {
//               onClose();
//               resetState();
//             }}
//             className="text-gray-500 hover:text-gray-700"
//             disabled={isUploading}
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         {showSuccessMessage && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <strong className="font-bold">Success!</strong>
//             <span className="block sm:inline"> Images uploaded successfully.</span>
//           </div>
//         )}

//         {isUploading ? (
//           <div className="flex flex-col items-center justify-center py-8">
//             <Loader className="animate-spin mb-4" size={48} />
//             <p className="text-lg font-semibold">Uploading images... {uploadProgress}%</p>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//               <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div
//               className={`mb-4 p-4 border-2 border-dashed rounded-lg text-center ${
//                 isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//               }`}
//             >
//               <p>Drag and drop images here, or</p>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 multiple
//                 className="mt-2"
//                 disabled={savedFiles.length + existingImageCount >= 10 || isUploading}
//               />
//               <p className="text-sm text-gray-500 mt-2">
//                 {existingImageCount !== null 
//                   ? `You can select up to ${Math.min(10 - existingImageCount - savedFiles.length, 10 - savedFiles.length)} more images. 
//                      (Total limit: 10, Currently uploaded: ${existingImageCount}, Selected: ${savedFiles.length})`
//                   : `You can select up to ${10 - savedFiles.length} more images. 
//                      (Selected: ${savedFiles.length}, Total limit: 10)`
//                 }
//               </p>
//             </div>

//             {savedFiles.map((file, index) => (
//               <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
//                 <p className="font-semibold">{file.file.name}</p>
//                 <select
//                   value={file.smearType}
//                   onChange={(e) => updateFileDetails(index, 'smearType', e.target.value)}
//                   className="mt-2 mr-2 p-2 border border-gray-300 rounded"
//                   required
//                 >
//                   <option value="">Select Smear Type</option>
//                   <option value="thick">Thick</option>
//                   <option value="thin">Thin</option>
//                 </select>
//                 <select
//                   value={file.testType}
//                   onChange={(e) => updateFileDetails(index, 'testType', e.target.value)}
//                   className="mt-2 p-2 border border-gray-300 rounded"
//                   required
//                 >
//                   <option value="">Select Test Type</option>
//                   <option value="Giemsa">Giemsa</option>
//                   <option value="Wright">Wright</option>
//                   <option value="Field">Field</option>
//                 </select>
//                 <button
//                   type="button"
//                   onClick={() => removeFile(index)}
//                   className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                   disabled={isUploading}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}

//             <div className="mt-4 flex items-center">
//               <div className="flex-1 bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
//                   style={{width: `${Math.min(((totalUploadedImages + savedFiles.length) / 10) * 100, 100)}%`}}
//                 ></div>
//               </div>
//               <span className="ml-2 text-sm font-medium text-gray-700">
//                 {totalUploadedImages + savedFiles.length}/10 images
//               </span>
//             </div>

//             <div className="flex justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   onClose();
//                   resetState();
//                 }}
//                 className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//                 disabled={isUploading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
//                 disabled={savedFiles.length === 0 || isUploading || totalUploadedImages + savedFiles.length > 10}
//               >
//                 <Upload className="mr-2" size={18} />
//                 Upload
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadImagesModal;
import React, { useState, useEffect, useCallback } from 'react';
import { uploadVisitImages, getVisitImageCount } from '../../services/api';
import { X, Upload, Loader, Activity, AlertCircle, CheckCircle, Image, FileType, Info } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const UploadImagesModal = ({ isOpen, onClose, visit, onUploadComplete, onMaxImagesUploaded }) => {
  const [savedFiles, setSavedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploadedImages, setTotalUploadedImages] = useState(0);
  const [existingImageCount, setExistingImageCount] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Maximum images allowed
  const MAX_IMAGES = 5;

  useEffect(() => {
    if (isOpen) {
      fetchExistingImageCount();
    }
  }, [isOpen, visit.patient_id]);

  const fetchExistingImageCount = async () => {
    try {
      const count = await getVisitImageCount(visit.visit_id);
      setExistingImageCount(count);
      setTotalUploadedImages(count);
    } catch (error) {
      console.error('Error fetching existing image count:', error);
      setExistingImageCount(null);
      setError('Unable to fetch existing image count. Proceeding with caution.');
    }
  };

  const resetState = useCallback(() => {
    setSavedFiles([]);
    setIsUploading(false);
    setIsDragging(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  const isAllowedFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(extension);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    await handleNewFiles(files);
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleNewFiles(files);
  }, []);

  const handleNewFiles = async (files) => {
    const validFiles = files.filter(isAllowedFile);
    if (validFiles.length < files.length) {
      setError('Some files were rejected. Only PNG, JPG, JPEG, and GIF are allowed.');
    }

    const maxNewFiles = existingImageCount !== null 
      ? Math.min(MAX_IMAGES - existingImageCount - savedFiles.length, MAX_IMAGES - savedFiles.length) 
      : MAX_IMAGES - savedFiles.length;

    const newFiles = validFiles.slice(0, maxNewFiles);

    if (newFiles.length === 0) {
      setError('No valid images were selected or maximum number of images reached.');
      return;
    }

    const compressedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const compressedFile = await imageCompression(file, { maxSizeMB: 1 });
        const newFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
          lastModified: new Date().getTime()
        });
        console.log('Compressed file:', newFile.name, newFile.type, newFile.size);
        return {
          file: newFile,
          smearType: '',
          testType: '',
        };
      })
    );

    setSavedFiles((prev) => [...prev, ...compressedFiles].slice(0, maxNewFiles));
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (savedFiles.length === 0) {
      setError('Please select at least one file before uploading');
      return;
    }

    if (savedFiles.some((file) => !file.smearType || !file.testType)) {
      setError('Please assign smear type and test type for all images');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();

    savedFiles.forEach((file, index) => {
      console.log(`Uploading file ${index + 1}:`, file.file.name, file.file.type, file.file.size);
      formData.append(`images`, file.file, file.file.name);
      formData.append(`smear_type`, file.smearType);
      formData.append(`test_type`, file.testType);
    });

    try {
      const response = await uploadVisitImages(visit.visit_id, formData, (progress) => {
        setUploadProgress(progress);
      });

      setIsUploading(false);
      setTotalUploadedImages(response.total_images);
      onUploadComplete(response.total_images);
      setShowSuccessMessage(true);

      if (response.total_images >= MAX_IMAGES) {
        onMaxImagesUploaded();
      }

      setTimeout(() => {
        setUploadProgress(0);
      }, 10000);

      setTimeout(() => {
        setShowSuccessMessage(false);
        resetState();
        onClose();
      }, 30000);

    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to upload images. Please try again later.');
      }
    }
  };

  const removeFile = (index) => {
    setSavedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileDetails = (index, field, value) => {
    setSavedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="bg-white rounded-xl shadow-lg w-[32rem] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white rounded-t-xl flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <Image className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">
              Upload Diagnostic Images
            </h2>
          </div>
          <button
            onClick={() => {
              onClose();
              resetState();
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Patient info summary */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              Patient: <span className="font-semibold">{visit.patient_name}</span> | Visit ID: {visit.visit_id}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 flex items-start" role="alert">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4 flex items-start" role="alert">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Success!</p>
                <p className="text-sm">Images uploaded successfully.</p>
              </div>
            </div>
          )}

          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Loader className="animate-spin h-10 w-10 text-blue-600" />
              </div>
              <p className="text-lg font-semibold mb-2">Uploading images...</p>
              <p className="text-sm text-gray-600 mb-3">{uploadProgress}% complete</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className={`mb-4 p-4 border-2 border-dashed rounded-lg text-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <FileType size={24} className="text-blue-500 mr-2" />
                  <span className="text-gray-700 font-medium">Drop your images here</span>
                </div>
                <p className="mb-2">Drag and drop diagnostic images, or</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="fileInput"
                  disabled={savedFiles.length + existingImageCount >= MAX_IMAGES || isUploading}
                />
                <label
                  htmlFor="fileInput"
                  className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                    savedFiles.length + existingImageCount >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Select Images
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  {existingImageCount !== null 
                    ? `You can select up to ${Math.max(0, MAX_IMAGES - existingImageCount - savedFiles.length)} more images. 
                       (Total limit: ${MAX_IMAGES}, Uploaded: ${existingImageCount}, Selected: ${savedFiles.length})`
                    : `You can select up to ${MAX_IMAGES - savedFiles.length} more images. 
                       (Selected: ${savedFiles.length}, Total limit: ${MAX_IMAGES})`
                  }
                </p>
              </div>

              {/* Image Requirements */}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Image Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Acceptable formats: PNG, JPG, JPEG, GIF</li>
                      <li>Maximum 5 images per visit</li>
                      <li>Files will be automatically compressed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Selected files list */}
              {savedFiles.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Selected Images</h3>
                  <div className="space-y-3">
                    {savedFiles.map((file, index) => (
                      <div key={index} className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-gray-800 truncate">{file.file.name}</p>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                            disabled={isUploading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Smear Type</label>
                            <select
                              value={file.smearType}
                              onChange={(e) => updateFileDetails(index, 'smearType', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              required
                            >
                              <option value="">Select Type</option>
                              <option value="thick">Thick</option>
                              <option value="thin">Thin</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Test Type</label>
                            <select
                              value={file.testType}
                              onChange={(e) => updateFileDetails(index, 'testType', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              required
                            >
                              <option value="">Select Test</option>
                              <option value="Giemsa">Giemsa</option>
                              <option value="Wright">Wright</option>
                              <option value="Field">Field</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload progress indicator */}
              <div className="mt-4 flex items-center mb-5">
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                    style={{width: `${Math.min(((totalUploadedImages + savedFiles.length) / MAX_IMAGES) * 100, 100)}%`}}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {totalUploadedImages + savedFiles.length}/{MAX_IMAGES} images
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetState();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center 
                    ${(savedFiles.length === 0 || totalUploadedImages + savedFiles.length > MAX_IMAGES) 
                      ? 'opacity-50 cursor-not-allowed bg-blue-400' 
                      : 'hover:bg-blue-700'}`}
                  disabled={savedFiles.length === 0 || isUploading || totalUploadedImages + savedFiles.length > MAX_IMAGES}
                >
                  <Upload className="mr-2" size={18} />
                  Upload Images
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImagesModal;