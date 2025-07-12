// src/services/api.js
import axios from 'axios';
import { io } from 'socket.io-client';  
import performanceTracker from './performanceTracker';


const API_URL = 'http://127.0.0.1:5000/api';
const SOCKET_URL = 'http://127.0.0.1:5000';

const socket = io(SOCKET_URL);

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // Implement refresh token logic here if needed
        return apiService(error.config);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);
// Add request interceptor with performance tracking
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add performance tracking
    const requestId = `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.metadata = { 
      requestId, 
      startTime: performance.now(),
      timestamp: Date.now()
    };
    
    // Track the request start
    performanceTracker.startOperation(requestId, 'api-request', {
      method: config.method,
      url: config.url,
      endpoint: config.url.replace(API_URL, ''),
      hasFile: config.headers['Content-Type'] === 'multipart/form-data'
    });
    
    // Add request ID to headers for backend correlation
    config.headers['X-Request-ID'] = requestId;
    
    // For upload requests, add client timing
    if (config.data instanceof FormData && config.url.includes('/images')) {
      config.data.append('upload_start_time', Date.now());
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with performance tracking
apiService.interceptors.response.use(
  (response) => {
    const config = response.config;
    if (config.metadata) {
      const { requestId } = config.metadata;
      const endTime = performance.now();
      
      // End the operation tracking
      const metric = performanceTracker.endOperation(requestId, 'success', {
        status: response.status,
        size: JSON.stringify(response.data).length,
        serverTiming: response.headers['x-response-time'] || null
      });
      
      // Log slow requests
      if (metric && metric.duration > 5000) {
        console.warn('Slow API request detected:', {
          url: config.url,
          duration: metric.duration,
          method: config.method
        });
      }
    }
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Track failed requests
    if (config && config.metadata) {
      const { requestId } = config.metadata;
      performanceTracker.endOperation(requestId, 'error', {
        status: error.response?.status,
        message: error.message,
        code: error.code
      });
    }
    
    // Handle 401 errors
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // Implement refresh token logic here if needed
        return apiService(error.config);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email, password, mfaToken, backupCode) => {
  try {
    const response = await apiService.post('/login', { 
      email, 
      password, 
      mfa_token: mfaToken, 
      backup_code: backupCode 
    });
    
    localStorage.setItem('token', response.data.access_token);

    console.log('Token saved to localStorage:', response.data.access_token);


    // Check if MFA setup is required
    if (response.data.require_mfa_setup) {
      console.log('MFA setup required');
      return { requireMFASetup: true, userId: response.data.user_id };
    }
    
    // Check if MFA verification is required
    if (response.data.require_mfa) {
      console.log('MFA verification required');
      return { requireMFA: true, userId: response.data.user_id };
    }
    
    // Normal login success
    console.log('Login successful');
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
export const getUserProfile = async () => {
    try {
      const response = await apiService.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };
export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};
export const register = (userData) => apiService.post('/register', userData);

export const getPatients = async (page = 1, limit = 10, status = 'all', searchTerm = '') => {
  try {
    const response = await apiService.get('/patients', {
      params: {
        page,
        limit,
        status,
        search: searchTerm
      }
    });
    return {
      patients: response.data.patients,
      totalPages: response.data.totalPages,
      total: response.data.total,
      page: response.data.page,
      per_page: response.data.per_page
    };
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};


export const getTotalPatients = () => 
  apiService.get('/patients', { params: { page: 1, limit: 10 } }) // Requesting with pagination
    .then(response => {
      if (response.data && response.data.total) {
        return response.data.total;  // Make sure 'total' is returned correctly
      } else {
        return 0;
      }
    })
    .catch(error => {
      console.error("Error fetching total patients:", error);
      return 0;
    });
    
// export const uploadVisitImages = async (visitId, formData, onProgress) => {
//   try {
//     const response = await apiService.post(`/visits/${visitId}/images`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent) => {
//         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         if (onProgress) {
//           onProgress(percentCompleted);
//         }
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     if (error.response) {
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//     }
//     throw error;
//   }
// };
// Enhanced upload function with detailed progress tracking
export const uploadVisitImages = async (visitId, formData, onProgress) => {
  const uploadId = `upload-${visitId}-${Date.now()}`;
  
  // Start tracking the upload operation
  performanceTracker.startOperation(uploadId, 'image-upload', {
    visitId,
    fileCount: formData.getAll('images').length,
    totalSize: formData.getAll('images').reduce((sum, file) => sum + file.size, 0)
  });
  
  try {
    // Mark preparation complete
    performanceTracker.mark(uploadId, 'preparation-complete');
    
    const response = await apiService.post(`/visits/${visitId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        
        // Track progress milestones
        if (percentCompleted === 25) {
          performanceTracker.addStep(uploadId, '25-percent', { loaded: progressEvent.loaded });
        } else if (percentCompleted === 50) {
          performanceTracker.addStep(uploadId, '50-percent', { loaded: progressEvent.loaded });
        } else if (percentCompleted === 75) {
          performanceTracker.addStep(uploadId, '75-percent', { loaded: progressEvent.loaded });
        } else if (percentCompleted === 100) {
          performanceTracker.addStep(uploadId, '100-percent', { loaded: progressEvent.loaded });
        }
        
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    
    // Mark upload complete
    performanceTracker.mark(uploadId, 'upload-complete');
    
    // End tracking with success
    const metrics = performanceTracker.endOperation(uploadId, 'success', {
      totalImages: response.data.total_images,
      uploadTime: response.data.performance?.upload_time,
      requestId: response.data.performance?.request_id
    });
    
    // Send metrics to backend
    sendPerformanceMetrics({
      clientMetrics: metrics,
      serverRequestId: response.data.performance?.request_id
    });
    
    return response.data;
  } catch (error) {
    // End tracking with error
    performanceTracker.endOperation(uploadId, 'error', {
      errorMessage: error.message,
      errorCode: error.response?.status
    });
    
    console.error('Error uploading images:', error);
    throw error;
  }
};
// Enhanced diagnosis initiation with performance tracking
export const initiateDiagnosis = async (visitId) => {
  const diagnosisId = `diagnosis-${visitId}-${Date.now()}`;
  
  console.log('Initiating diagnosis for visit:', visitId);
  
  // Start tracking
  performanceTracker.startOperation(diagnosisId, 'diagnosis', { visitId });
  
  try {
    performanceTracker.addStep(diagnosisId, 'request-sent');
    
    const response = await apiService.post(`/visits/${visitId}/initiate-diagnosis`);
    
    performanceTracker.addStep(diagnosisId, 'response-received');
    
    // End tracking with success
    const metrics = performanceTracker.endOperation(diagnosisId, 'success', {
      processingTime: response.data.performance?.processing_time,
      requestId: response.data.performance?.request_id,
      parasiteCount: response.data.summary?.total_parasites
    });
    
    // Send metrics to backend
    sendPerformanceMetrics({
      clientMetrics: metrics,
      serverRequestId: response.data.performance?.request_id
    });
    
    console.log('Diagnosis initiation response:', response);
    return response.data;
  } catch (error) {
    // End tracking with error
    performanceTracker.endOperation(diagnosisId, 'error', {
      errorMessage: error.message,
      errorCode: error.response?.status
    });
    
    console.error('Error initiating diagnosis:', error);
    throw error;
  }
};

// Function to send performance metrics to backend
const sendPerformanceMetrics = async (metrics) => {
  try {
    // Send metrics in background, don't block main operation
    apiService.post('/analytics/client-metrics', metrics).catch(err => {
      console.warn('Failed to send performance metrics:', err);
    });
  } catch (error) {
    console.warn('Error sending performance metrics:', error);
  }
};

// Performance monitoring API endpoints
export const getPerformanceAnalytics = async (params = {}) => {
  try {
    const response = await apiService.get('/analytics/performance', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    throw error;
  }
};

export const getRealtimePerformance = async () => {
  try {
    const response = await apiService.get('/analytics/performance/realtime');
    return response.data;
  } catch (error) {
    console.error('Error fetching realtime performance:', error);
    throw error;
  }
};

// WebSocket performance monitoring
export const subscribeToPerformanceUpdates = (callback) => {
  socket.emit('subscribe_performance');
  socket.on('performance_update', callback);
  socket.on('slow_operation_alert', callback);
  socket.on('performance_subscribed', () => {
    console.log('Subscribed to performance updates');
  });
};

export const unsubscribeFromPerformanceUpdates = () => {
  socket.emit('unsubscribe_performance');
  socket.off('performance_update');
  socket.off('slow_operation_alert');
};

export const getPerformanceHistory = (hours = 24, endpoint = null) => {
  socket.emit('get_performance_history', { hours, endpoint });
};

export const getEndpointPerformance = () => {
  socket.emit('get_endpoint_performance');
};

// Set up performance monitoring listeners
socket.on('performance_history', (data) => {
  console.log('Performance history received:', data);
});

socket.on('endpoint_performance', (data) => {
  console.log('Endpoint performance received:', data);
});

socket.on('performance_error', (error) => {
  console.error('Performance monitoring error:', error);
});

// Export performance tracker for direct access
export { performanceTracker };
export const getVisitImageCount = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/image-count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching image count:', error);
    throw error;
  }
};


export const subscribeToProcessingUpdates = (patientId, callback) => {
  socket.emit('join', { patient_id: patientId });
  socket.on('processing_update', callback);
};

export const unsubscribeFromProcessingUpdates = (patientId) => {
  socket.emit('leave', { patient_id: patientId });
  socket.off('processing_update');
};
export const getVisitImages = (visitId) => apiService.get(`/visits/${visitId}/images`);

export const sendVerificationEmail = (email) => apiService.post('/send-verification-email', { email });


export const getPatient = async (patientId) => {
  try {
    const response = await apiService.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};


export const getDashboardStats = async () => {
  try {
    const response = await apiService.get('/dashboard/stats');
    
    // Check if response is successful
    if (response.status !== 200) {
      throw new Error('Failed to fetch dashboard stats');
    }

    // Log the raw response data for debugging
    console.log('Raw dashboard stats data:', response.data);

    // Ensure the response data is in the expected format
    const data = response.data;

    // Return the dashboard stats
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {};
  }
};
export const getPatientInflux = async () => {
  try {
    const response = await apiService.get('/patients/influx');
    return response.data.influx_data;
  } catch (error) {
    console.error('Error fetching patient influx data:', error);
    throw error;
  }
};

export const get_images = async (image_id) => {
  try {
    const response = await apiService.get(`${image_id}/images`);
    return response.data;
  } catch (error) {
    console.error('Error fetching visit images:', error);
    throw error;
  }
};

// Get an image with bounding boxes drawn around detections
export const getImageWithDetections = (imageId) => {
  // The URL returns the actual image file, not JSON
  return `${API_URL}/images/${imageId}/with-detections`;
};

// Get detection summary for all images in a visit
export const getVisitDetectionSummary = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/detection-summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching detection summary:', error);
    throw error;
  }
};

// Force refresh an image with detections (useful if the image analysis has been updated)
export const refreshImageDetections = async (imageId) => {
  try {
    const response = await apiService.get(`/images/${imageId}/with-detections?force=true`, {
      responseType: 'blob' // Important: get the image as binary data
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error refreshing image detections:', error);
    throw error;
  }
};
export const getDiagnosisResults = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/diagnosis-results`);
    console.log("API response for diagnosis results:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching diagnosis results:", error);
    throw error;
  }
};
export const getChartData = async () => {
  try {
    const response = await apiService.get('/dashboard/chart-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await apiService.post('/patients', patientData);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await apiService.put(`/patients/${patientId}`, patientData);
    if (response.status !== 200) {
      throw new Error('Failed to update patient');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await apiService.delete(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};


export const advancedSearchPatients = async (searchParams) => {
  try {
    const response = await apiService.get('/patients/advanced-search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error performing advanced search:', error);
    throw error;
  }
};
export const searchPatients = async (params) => {
  try {
    const response = await apiService.get('/patients/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};


// Visit Management
export const createVisit = async (patientId, visitData) => {
  try {
    const response = await apiService.post(`/patients/${patientId}/visits`, visitData);
    return response.data;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};
export const getPatientVisits = async (patientId, page = 1, limit = 10) => {
  try {
    const response = await apiService.get(`/patients/${patientId}/visits`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient visits:', error);
    throw error;
  }
};

export const getPatientsWithVisits = async () => {
  try {
    const response = await apiService.get('/patients/with-visits');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients with visits:', error);
    throw error;
  }
};

export const getVisitDetails = async (visitId) => {
  console.log("API: Fetching visit details for visitId:", visitId);
  try {
    const response = await apiService.get(`/visits/${visitId}`);
    console.log("API: Received visit details:", response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error fetching visit details:', error);
    throw error;
  }
};
export const updateVisit = (visitId, visitData) => apiService.put(`/visits/${visitId}`, visitData);
export const deleteVisit = (visitId) => apiService.delete(`/visits/${visitId}`);
export const getVisitStatus = (visitId) => apiService.get(`/visits/${visitId}/status`);


// New functions to add
export const getAnalyticsData = async () => {
  try {
    const response = await apiService.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export const getPendingDiagnoses = async () => {
  try {
    const response = await apiService.get('/diagnoses/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending diagnoses:', error);
    throw error;
  }
};

export const submitDiagnosis = async (visitId, diagnosisData) => {
  try {
    const response = await apiService.post(`/visits/${visitId}/diagnosis`, diagnosisData);
    return response.data;
  } catch (error) {
    console.error('Error submitting diagnosis:', error);
    throw error;
  }
};


// Download visit report
export const downloadVisitReport = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/download-report`, {
      responseType: 'blob', 
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};
// Get notifications
export const getNotifications = async () => {
  try {
    const response = await apiService.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = (notificationId) => apiService.post(`/notifications/${notificationId}/mark-read`);

// Get chats
export const getChats = async () => {
  const response = await apiService.get('/chats');
  return response.data;
};

// Get chat messages
export const getChatMessages = (chatId) => apiService.get(`/chats/${chatId}/messages`);

// Send message
export const sendMessage = (chatId, content) => apiService.post(`/chats/${chatId}/messages`, { content });

export const createNewChat = async (participantId) => {
  const response = await apiService.post('/chats', { participant_id: participantId });
  return response.data;
};
// Get diagnosis trends
export const getDiagnosisTrends = (startDate, endDate) => apiService.get('/diagnosis-trends', {
  params: { start_date: startDate, end_date: endDate }
});

// Get statistics
export const getStatistics = () => apiService.get('/statistics');


export const subscribeToNewNotifications = (callback) => {
  socket.on('new_notification', callback);
};

export const subscribeToNewMessages = (callback) => {
  socket.on('new_message', callback);
};


export const joinRoom = (roomName) => {
  socket.emit('join', { room: roomName });
};

export const leaveRoom = (roomName) => {
  socket.emit('leave', { room: roomName });
};

// MFA routes
export const enableMFA = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token before MFA request:', token);  
    const response = await apiService.post('/enable-mfa');
    return response.data;
  } catch (error) {
    console.error('Error enabling MFA:', error);
    throw error;
  }
};


export const verifyMFA = async (token) => {
  try {
    const response = await apiService.post('/verify-mfa', { token });
    return response.data;
  } catch (error) {
    console.error('Error verifying MFA:', error);
    throw error;
  }
};

export const disableMFA = async (password) => {
  try {
    const response = await apiService.post('/disable-mfa',{password});
    return response.data;
  } catch (error) {
    console.error('Error disabling MFA:', error);
    throw error;
  }
};


export const checkMFAStatus = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if no token is present
    console.error('No token found, redirecting to login');
    // Handle the logic to redirect to login page
    return;
  }

  try {
    const response = await apiService.get('/check-mfa-status');
    
    // Log the response to ensure correct data
    console.log('MFA status response:', response.data);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Log the error response for easier debugging
      console.error('Error checking MFA status - Response:', error.response);

      // Handle specific errors like 401 Unauthorized
      if (error.response.status === 401) {
        console.error('Unauthorized - Redirecting to login');
        // Clear token and redirect to login
        localStorage.removeItem('token');
        // Redirect to login page logic
      }
    } else {
      console.error('Error checking MFA status:', error.message);
    }

    throw error;
  }
};

// Add this function to your api.js file
export const resetPassword = async (email) => {
  try {
    const response = await apiService.post('/reset-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Make sure this function is also exported
export const confirmPasswordReset = async (token, newPassword, mfaToken, backupCode) => {
  try {
    const response = await apiService.post(`/confirm-password-reset/${token}`, {
      new_password: newPassword,
      mfa_token: mfaToken,
      backup_code: backupCode
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};
export const generateNewBackupCodes = async () => {
  try {
    const response = await apiService.post('/generate-backup-codes');
    return response.data;
  } catch (error) {
    console.error('Error generating new backup codes:', error);
    throw error;
  }
};
// Fetch patient demographics data
export const getPatientDemographics = async () => {
  try {
    const response = await apiService.get('/patient/demographics');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    throw error;
  }
};
// Fetch diagnosis report data within a specified date range
export const getDiagnosisReport = async (startDate, endDate) => {
  try {
    const response = await apiService.get('/diagnosis/report', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosis report:', error);
    throw error;
  }
};
// Fetch system performance metrics
export const getPerformanceMetrics = async () => {
  try {
    const response = await apiService.get('/diagnosis/performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};
// Add these functions to your api.js file

// Get diagnosis summary with validation data
export const getDiagnosisSummary = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/diagnosis-summary`);
    console.log("API response for diagnosis summary:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching diagnosis summary:", error);
    throw error;
  }
};

// Enhanced getDiagnosisResults with better error handling and logging
export const getDiagnosisResultsEnhanced = async (visitId) => {
  try {
    const response = await apiService.get(`/visits/${visitId}/diagnosis-results`);
    console.log("API response for diagnosis results:", response.data);
    
    // Log the structure to help debug
    console.log("Response structure:", {
      hasOverallDiagnosis: !!response.data.overall_diagnosis,
      hasImageDiagnoses: !!response.data.image_diagnoses,
      hasSummary: !!response.data.summary,
      summaryKeys: response.data.summary ? Object.keys(response.data.summary) : [],
      hasCountingValidation: !!response.data.summary?.counting_validation
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching diagnosis results:", error);
    throw error;
  }
};

// Test function to check what endpoints are available
export const testDiagnosisEndpoints = async (visitId) => {
  const results = {};
  
  // Test various endpoint variations
  const endpoints = [
    `/visits/${visitId}/diagnosis-results`,
    `/visits/${visitId}/diagnosis-summary`, 
    `/visits/${visitId}/diagnosis`,
    `/visits/${visitId}/summary`,
    `/visits/${visitId}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await apiService.get(endpoint);
      results[endpoint] = {
        success: true,
        hasData: !!response.data,
        hasCountingValidation: !!response.data.summary?.counting_validation || !!response.data.counting_validation,
        structure: Object.keys(response.data || {})
      };
    } catch (error) {
      results[endpoint] = {
        success: false,
        error: error.response?.status || error.message
      };
    }
  }
  
  console.log("Endpoint test results:", results);
  return results;
};

export default apiService;