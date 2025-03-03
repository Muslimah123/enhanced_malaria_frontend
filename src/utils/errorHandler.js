export const handleApiError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      return 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return 'An unexpected error occurred';
    }
  };