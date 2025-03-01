import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchRegisterUser = (userData) => {
  return axios.post(`${api_url}/v1/register`, userData)
    .then(res => res.data)
    .catch(error => { throw error.response?.data || error; });
};

export const fetchLoginUser = (credentials) => {
  return axios.post(`${api_url}/v1/login`, credentials)
    .then(res => res.data)
    .catch(error => { throw error.response?.data || error; });
};

export const fetchRefreshToken = (refreshToken) => {
  return axios.post(`${api_url}/v1/refresh`, { refresh_token: refreshToken })
    .then(res => {
      document.cookie = `access_token=${res.data.access_token}; path=/; max-age=86400`; // 24 hours
      document.cookie = `refresh_token=${res.data.refresh_token}; path=/; max-age=2592000`; // 30 days
      return res.data;
    })
    .catch(error => { throw error.response?.data || error; });
};