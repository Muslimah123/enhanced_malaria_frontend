
// src/components/Dashboard/ParasiteDetectionSection.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getVisitDetectionSummary, 
  getImageWithDetections, 
  refreshImageDetections 
} from '../../services/api';
import { 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Grid3X3, 
  List, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  Target,
  Activity,
  Search
} from 'lucide-react';

const ParasiteDetectionSection = ({ visitId, diagnosisResult }) => {
  const [detectionSummary, setDetectionSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [refreshingImage, setRefreshingImage] = useState(null);

  useEffect(() => {
    fetchDetectionSummary();
  }, [visitId, diagnosisResult]);

  const fetchDetectionSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getVisitDetectionSummary(visitId);
      setDetectionSummary(summary);
      console.log('Detection summary:', summary);
      
      // ✅ Debug log confidence calculations
      if (summary.images?.length > 0) {
        console.log('Sample image confidence calculation:');
        summary.images.forEach((img, idx) => {
          if (img.detections?.parasites?.length > 0) {
            const confidences = img.detections.parasites.map(p => (p.confidence || 0) * 100);
            const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
            console.log(`Image ${idx + 1}: Individual confidences:`, confidences, 'Average:', avg.toFixed(1) + '%');
          }
        });
      }
    } catch (err) {
      console.error('Error fetching detection summary:', err);
      setError('Failed to load detection data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
    setZoomLevel(1);
  };

  const handleRefreshImage = async (imageId) => {
    setRefreshingImage(imageId);
    try {
      await refreshImageDetections(imageId);
      await fetchDetectionSummary(); // Refresh the summary
    } catch (error) {
      console.error('Error refreshing image:', error);
    } finally {
      setRefreshingImage(null);
    }
  };

  // ✅ Calculate per-image confidence from individual bounding box scores
  const calculateImageConfidence = (imageData) => {
    if (!imageData?.detections?.parasites?.length) return 0;
    
    const totalConfidence = imageData.detections.parasites.reduce((sum, parasite) => {
      return sum + ((parasite.confidence || 0) * 100); // Convert to percentage
    }, 0);
    
    return totalConfidence / imageData.detections.parasites.length;
  };

  const getDetectionSummary = (imageData) => {
    if (!imageData) {
      return { parasites: 0, wbcs: 0, confidence: 0 };
    }

    const parasites = imageData.parasite_count || 0;
    const wbcs = imageData.wbc_count || 0;
    const confidence = calculateImageConfidence(imageData);

    return { parasites, wbcs, confidence };
  };

  // ✅ Show per-image confidence calculated from bounding boxes
  const renderDetectionBadges = (imageData) => {
    const summary = getDetectionSummary(imageData);
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full flex items-center">
          <Target size={12} className="mr-1" />
          {summary.parasites} Parasites
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center">
          <Activity size={12} className="mr-1" />
          {summary.wbcs} WBCs
        </span>
        {summary.confidence > 0 && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center">
            <CheckCircle size={12} className="mr-1" />
            {summary.confidence.toFixed(1)}% Avg
          </span>
        )}
      </div>
    );
  };

  const ImageCard = ({ image, index }) => {
    const imageUrl = getImageWithDetections(image.image_id);
    const isRefreshing = refreshingImage === image.image_id;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="relative">
          {/* Image */}
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={imageUrl}
              alt={`Blood smear ${index + 1} with detections`}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleImageClick(image)}
              onError={(e) => {
                e.target.src = '/api/placeholder/400/400'; // Fallback image
              }}
            />
            
            {/* Zoom overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <ZoomIn size={24} className="text-gray-600" />
                </div>
              </div>
            </div>

            {/* Loading overlay for refresh */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-full p-3">
                  <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Image info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">Image #{index + 1}</h4>
              <button
                onClick={() => handleRefreshImage(image.image_id)}
                disabled={isRefreshing}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="Refresh detections"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              ID: {image.image_id}
            </p>

            {/* Detection badges - simplified without confidence */}
            {renderDetectionBadges(image)}

            {/* View button */}
            <button
              onClick={() => handleImageClick(image)}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <Eye size={16} className="mr-2" />
              View Detections
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ImageModal = () => {
    if (!selectedImage) return null;

    const imageUrl = getImageWithDetections(selectedImage.image_id);

    return (
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl max-h-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Image #{detectionSummary?.images?.findIndex(img => img.image_id === selectedImage.image_id) + 1} - Detections
                  </h3>
                  <p className="text-gray-600">Image ID: {selectedImage.image_id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <span className="text-sm text-gray-600 min-w-16 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="flex-1">
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <div className="overflow-auto max-h-96">
                        <img
                          src={imageUrl}
                          alt={`Blood smear with detections`}
                          className="transition-transform duration-300"
                          style={{ 
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'top left'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detection Info */}
                  <div className="lg:w-80">
                    <h4 className="font-semibold text-gray-800 mb-4">Detection Summary</h4>
                    
                    <div className="space-y-4">
                      {/* Simplified badges without confidence */}
                      {renderDetectionBadges(selectedImage)}
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-2">Detection Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Parasite Count:</span>
                            <span className="font-medium">{selectedImage.parasite_count || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">WBC Count:</span>
                            <span className="font-medium">{selectedImage.wbc_count || 0}</span>
                          </div>
                          {/* ✅ Show per-image confidence calculated from bounding boxes */}
                          {/* {(() => {
                            const imageConfidence = calculateImageConfidence(selectedImage);
                            return imageConfidence > 0 ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Image Average Confidence:</span>
                                <span className="font-medium">
                                  {imageConfidence.toFixed(1)}%
                                </span>
                              </div>
                            ) : null;
                          })()} */}
                        </div>
                      </div>

                      {/* ✅ Show individual parasite detections with their confidence scores
                      {selectedImage.detections?.parasites?.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-4">
                          <h5 className="font-medium text-red-800 mb-2">Detected Parasites</h5>
                          <div className="space-y-2">
                            {selectedImage.detections.parasites.map((parasite, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-red-700 font-medium">{parasite.type}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                    {((parasite.confidence || 0) * 100).toFixed(1)}%
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    #{i + 1}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-red-700 font-semibold">Image Average:</span>
                              <span className="text-red-800 font-bold">
                                {calculateImageConfidence(selectedImage).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )} */}

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-medium text-blue-800 mb-2">Legend</h5>
                        <div className="space-y-1 text-sm text-blue-700">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span>Parasites</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span>White Blood Cells</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ✅ Calculate overall confidence from all image detections
  const calculateOverallConfidence = () => {
    if (!detectionSummary?.images?.length) return 0;
    
    let totalConfidence = 0;
    let totalDetections = 0;
    
    detectionSummary.images.forEach(image => {
      if (image.detections?.parasites?.length) {
        image.detections.parasites.forEach(parasite => {
          totalConfidence += ((parasite.confidence || 0) * 100);
          totalDetections += 1;
        });
      }
    });
    
    return totalDetections > 0 ? totalConfidence / totalDetections : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detection data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Detections</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDetectionSummary}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!detectionSummary || !detectionSummary.images || detectionSummary.images.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Detection Data Available</h3>
        <p className="text-gray-600">No images with detection data found for this visit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium text-sm">Total Parasites</p>
              <p className="text-3xl font-bold text-red-800">
                {detectionSummary.total_parasites || 
                 detectionSummary.images?.reduce((sum, img) => sum + (img.parasite_count || 0), 0) || 0}
              </p>
            </div>
            <div className="p-3 bg-red-200 rounded-xl">
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium text-sm">Total WBCs</p>
              <p className="text-3xl font-bold text-blue-800">
                {detectionSummary.total_wbcs || 
                 detectionSummary.images?.reduce((sum, img) => sum + (img.wbc_count || 0), 0) || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-xl">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium text-sm">Model Confidence</p>
              <p className="text-3xl font-bold text-green-800">
                {/* ✅ Use model's overall confidence from diagnosisResult */}
                {diagnosisResult?.average_confidence 
                  ? `${diagnosisResult.average_confidence.toFixed(1)}%` 
                  : 'N/A'
                }
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">
          Analyzed Images ({detectionSummary.images.length})
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid3X3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={fetchDetectionSummary}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh all"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Images Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {detectionSummary.images.map((image, index) => (
          <ImageCard key={image.image_id} image={image} index={index} />
        ))}
      </div>

      {/* Image Modal */}
      <ImageModal />
    </div>
  );
};

export default ParasiteDetectionSection;