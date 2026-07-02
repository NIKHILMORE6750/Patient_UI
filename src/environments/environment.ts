export const environment = {
  production: false,
  // The API Gateway is the single entry point for the whole system.
  // Auth requests go to /auth/** and patient requests to /api/patients/**.
  apiBaseUrl: 'http://localhost:4004'
};
