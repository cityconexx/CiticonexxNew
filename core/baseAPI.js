import axios from 'axios';

// Create axios client, pre-configured with baseURL
let baseAPI = axios.create({
  baseURL: 'https://demoapi.cityconexx.com.au/BackendApi/',
  timeout: 100000,
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  baseAPI.interceptors.request.use(function(config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
export default baseAPI;