// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080',
    FRONTEND_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'https://potato-traceability-backend.azurewebsites.net',
    FRONTEND_URL: 'https://potato-traceability-frontend.azurestaticapps.net'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export default config[environment];

